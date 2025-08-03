import { Page } from '@playwright/test';
import { loadFixtureWithReplacements } from './fixtures';
import { analyticsConfig } from '../config/analyticsConfig';

declare global {
  interface Window {
    __analyticsEvents?: unknown[];
  }
}

/**
 * Determines whether an analytics event should be included based on a filter key.
 *
 * @param {unknown} event - The analytics event to evaluate.
 * @param {string} filterKey - A string in the format 'key', 'value', or 'key:value'.
 * @returns {boolean} - True if the event matches the filter, false otherwise.
 */
function shouldIncludeEvent(event: unknown, filterKey: string): boolean {
  if (typeof event !== 'object' || event === null) return false;
  const [key, value] = filterKey.includes(':') ? filterKey.split(':') : [filterKey, undefined];
  return containsKeyValue(event, key, value);
}

/**
 * Recursively checks whether an object contains a specific key-value pair.
 *
 * @param {unknown} obj - The object to search.
 * @param {string} key - The key to look for.
 * @param {string} [value] - Optional value to match.
 * @returns {boolean} - True if the key (and value, if provided) is found.
 */
function containsKeyValue(obj: unknown, key: string, value?: string): boolean {
  if (obj === null) return false;
  if (typeof obj !== 'object') return key === String(obj) && value === undefined;
  if (Array.isArray(obj)) return obj.some(item => containsKeyValue(item, key, value));

  const record = obj as Record<string, unknown>;
  for (const [k, v] of Object.entries(record)) {
    if (k === key && (value === undefined || String(v) === value)) return true;
    if (typeof v !== 'object' && value === undefined && String(v) === key) return true;
    if (typeof v === 'object' && v !== null && containsKeyValue(v, key, value)) return true;
  }

  return false;
}

/**
 * Performs a deep comparison between two objects or arrays.
 *
 * @param {unknown} actual - The actual event object.
 * @param {unknown} expected - The expected event structure.
 * @returns {boolean} - True if the actual matches the expected structure.
 */
function deepMatch(actual: unknown, expected: unknown): boolean {
  if (Array.isArray(expected)) {
    if (!Array.isArray(actual) || actual.length !== expected.length) return false;
    return expected.every((val, i) => deepMatch(actual[i], val));
  }

  if (typeof expected !== 'object' || expected === null) return actual === expected;
  if (typeof actual !== 'object' || actual === null) return false;

  const expectedObj = expected as Record<string, unknown>;
  const actualObj = actual as Record<string, unknown>;

  return Object.entries(expectedObj).every(
    ([key, val]) => key in actualObj && deepMatch(actualObj[key], val)
  );
}

/**
 * Logs analytics events to the console when a test fails or when debugging is enabled.
 *
 * @param {unknown[] | undefined} events - Captured analytics events.
 * @param {unknown} expected - The expected event structure.
 */
function logEventsOnFailure(events: unknown[] | undefined, expected: unknown) {
  const debugAnalytics = analyticsConfig.debugAnalytics as 'always' | 'never' | 'ifFail';
  const { enableFiltering, filterKey } = analyticsConfig;
  if (debugAnalytics === 'never') return;

  const allEvents = Array.isArray(events) ? events : [];
  const filteredEvents = enableFiltering
    ? allEvents.filter(event => shouldIncludeEvent(event, filterKey))
    : allEvents;

  if (filteredEvents.length > 0) {
    filteredEvents.forEach(event => {
      console.log('[AnalyticsSpy] Filtered Event:\n', JSON.stringify(event, null, 2));
    });
  } else {
    if (allEvents.length > 0) {
      console.log(
        `[AnalyticsSpy] ${allEvents.length} events captured, but none matched the filter '${filterKey}'.`
      );
    } else {
      console.log('[AnalyticsSpy] No analytics events captured.');
    }
  }

  console.log('[AnalyticsSpy] Expected event:\n', JSON.stringify(expected, null, 2));
}

/**
 * Injects a spy into the page to capture analytics events pushed to the data layer.
 *
 * @param {Page} page - The Playwright page object.
 * @returns {Promise<void>}
 */
export async function initAnalyticsSpy(page: Page) {
  await page.addInitScript(
    config => {
      const source = config.source;
      const debugMode = config.debugMode as 'always' | 'never' | 'ifFail';
      const { enableFiltering, filterKey } = config;

      function shouldIncludeEvent(event: unknown, filterKey: string): boolean {
        if (typeof event !== 'object' || event === null) return false;
        const [key, value] = filterKey.includes(':')
          ? filterKey.split(':')
          : [filterKey, undefined];
        return containsKeyValue(event, key, value);
      }

      function containsKeyValue(obj: unknown, key: string, value?: string): boolean {
        if (obj === null) return false;
        if (typeof obj !== 'object') return key === String(obj) && value === undefined;
        if (Array.isArray(obj)) return obj.some(item => containsKeyValue(item, key, value));

        const record = obj as Record<string, unknown>;
        for (const [k, v] of Object.entries(record)) {
          if (k === key && (value === undefined || String(v) === value)) return true;
          if (typeof v !== 'object' && value === undefined && String(v) === key) return true;
          if (typeof v === 'object' && v !== null && containsKeyValue(v, key, value)) return true;
        }

        return false;
      }

      window.__analyticsEvents = [];

      const win = window as unknown as Record<string, unknown>;
      const targetLayer = (win[source] as unknown[]) || [];
      const originalPush = targetLayer.push?.bind(targetLayer);

      targetLayer.push = function (...args: unknown[]) {
        window.__analyticsEvents?.push(...args);

        if (debugMode === 'always') {
          args.forEach(event => {
            if (!enableFiltering || shouldIncludeEvent(event, filterKey)) {
              console.log('[AnalyticsSpy] Event pushed:\n', JSON.stringify(event, null, 2));
            }
          });
        }

        return originalPush?.(...args);
      };

      win[source] = targetLayer;
    },
    {
      source: analyticsConfig.source,
      debugMode: analyticsConfig.debugAnalytics,
      enableFiltering: analyticsConfig.enableFiltering,
      filterKey: analyticsConfig.filterKey,
    }
  );
}

/**
 * Verifies that a specific analytics event was captured and matches the expected structure.
 *
 * @param {Page} page - The Playwright page object.
 * @param {string} fixtureName - Name of the fixture file (without extension).
 * @param {Record<string, string | number>} [replacements] - Optional replacements for placeholders in the fixture.
 * @param {number} [timeoutMs=10000] - Optional timeout in milliseconds (default is 10 seconds).
 * @param {number} [pollIntervalMs=250] - Optional polling interval in milliseconds (default is 250ms).
 * @returns {Promise<void>}
 * @throws Will throw an error if no matching event is found.
 */
export async function checkAnalyticsEvent(
  page: Page,
  fixtureName: string,
  replacements?: Record<string, string | number>,
  timeoutMs: number = 10000,
  pollIntervalMs: number = 250
) {
  const expectedEvent = loadFixtureWithReplacements(`analytics/${fixtureName}`, replacements);
  const start = Date.now();

  while (Date.now() - start < timeoutMs) {
    const events = await page.evaluate(() => window.__analyticsEvents);
    if (events && events.some(event => deepMatch(event, expectedEvent))) {
      return;
    }
    await page.waitForTimeout(pollIntervalMs);
  }

  // Final check and error reporting
  const events = await page.evaluate(() => window.__analyticsEvents);
  logEventsOnFailure(events, expectedEvent);
  throw new Error(
    `Expected analytics event not found within ${timeoutMs}ms:\n${JSON.stringify(expectedEvent, null, 2)}`
  );
}
