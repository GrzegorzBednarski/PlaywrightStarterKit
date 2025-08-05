import { Page, expect } from '@playwright/test';
import performanceConfig from '../config/performanceConfig';
import { logPerformanceResults, saveReports, type PerformanceResult } from './performanceReport';

/**
 * Configuration override options for performance audit
 */
type PerformanceOverride = {
  categories?: string[];
  thresholds?: Record<string, number>;
  chromeFlags?: string[];
  onlyAudits?: string[] | null;
  debugPerformance?: 'always' | 'never' | 'ifFail';
  formFactor?: 'desktop' | 'mobile';
};

/**
 * Get merged lighthouse options with form factor configuration
 */
function getLighthouseOptions(overrideFormFactor?: 'desktop' | 'mobile') {
  const formFactor = overrideFormFactor || performanceConfig.formFactor;
  const formFactorConfig =
    performanceConfig.formFactorConfigs[
      formFactor as keyof typeof performanceConfig.formFactorConfigs
    ];

  return {
    ...performanceConfig.lighthouseOptions,
    ...formFactorConfig,
    screenEmulation: {
      ...formFactorConfig.screenEmulation,
      disabled: false, // Always false for controlled emulation
    },
  };
}

/**
 * Generate safe filename from URL
 */
function createFilenameFromUrl(url: string): string {
  return url
    .replace(/https?:\/\//, '') // Remove protocol
    .replace(/[/\\:*?"<>|]/g, '_') // Replace invalid filename characters
    .replace(/_{2,}/g, '_') // Replace multiple underscores with single
    .replace(/^_|_$/g, ''); // Remove leading/trailing underscores
}

/**
 * Generate timestamp for filename
 */
function createTimestamp(): string {
  return new Date().toISOString().replace(/[:.]/g, '-').replace('T', '_').substring(0, 19);
}

/**
 * Analyze lighthouse results against thresholds
 */
function analyzeResults(
  lighthouseResult: any,
  categories: string[],
  thresholds: Record<string, number>
): {
  results: Record<string, PerformanceResult>;
  failures: string[];
  hasFailed: boolean;
} {
  const failures: string[] = [];
  const results: Record<string, PerformanceResult> = {};

  Object.entries(thresholds).forEach(([category, threshold]) => {
    if (!categories.includes(category)) {
      return;
    }

    const score = lighthouseResult.lhr.categories[category]?.score || 0;
    const actualPercent = Math.round(score * 100);
    const thresholdPercent = Math.round(threshold * 100);
    const passed = score >= threshold;

    results[category] = {
      actual: actualPercent,
      threshold: thresholdPercent,
      passed,
    };

    if (!passed) {
      failures.push(`${category}: ${actualPercent}% < ${thresholdPercent}%`);
    }
  });

  return {
    results,
    failures,
    hasFailed: failures.length > 0,
  };
}

/**
 * Runs a Lighthouse performance audit on the current page.
 *
 * @param page - The Playwright page object to audit
 * @param override - Optional configuration to override default performance settings
 * @param override.categories - Lighthouse categories to test
 * @param override.thresholds - Score thresholds for each category (0-1 scale)
 * @param override.chromeFlags - Chrome launch flags to use
 * @param override.onlyAudits - Specific audits to run (null for all)
 * @param override.debugPerformance - Console logging behavior
 * @param override.formFactor - Device form factor (desktop/mobile)
 *
 * @example
 * ```typescript
 * // Basic usage with default configuration
 * await runPerformanceAudit(page);
 * ```
 *
 * @example
 * ```typescript
 * // Override to test only performance category
 * await runPerformanceAudit(page, {
 *   categories: ['performance'],
 *   thresholds: { performance: 0.90 },
 *   formFactor: 'mobile'
 * });
 * ```
 */
export default async function runPerformanceAudit(
  page: Page,
  override?: PerformanceOverride
): Promise<void> {
  const url = page.url();

  const enabledCategories = performanceConfig.categories
    .filter(cat => cat.enabled)
    .map(cat => cat.name);

  const finalCategories = override?.categories || enabledCategories;
  const finalThresholds = { ...performanceConfig.thresholds, ...override?.thresholds };
  const finalChromeFlags = override?.chromeFlags || performanceConfig.chromeFlags;
  const finalOnlyAudits = override?.onlyAudits !== undefined ? override.onlyAudits : null;
  const finalDebugPerformance = override?.debugPerformance || performanceConfig.debugPerformance;
  const finalFormFactor = override?.formFactor || performanceConfig.formFactor;

  const { launch } = await import('chrome-launcher');
  const { default: lighthouse } = await import('lighthouse');

  const chrome = await launch({ chromeFlags: finalChromeFlags });

  try {
    const result = await lighthouse(url, {
      port: chrome.port,
      onlyCategories: finalCategories,
      onlyAudits: finalOnlyAudits,
      output: ['html', 'json'], // Always generate both HTML and JSON
      ...getLighthouseOptions(override?.formFactor),
    });

    if (!result) {
      throw new Error('Lighthouse audit failed to generate results');
    }

    const urlForFilename = createFilenameFromUrl(url);
    const timestamp = createTimestamp();
    const baseFilename = `${urlForFilename}_[${finalFormFactor}]_${timestamp}`;

    saveReports(result, performanceConfig.reportsOutputFolder, baseFilename);

    const analysis = analyzeResults(result, finalCategories, finalThresholds);

    const shouldLog =
      finalDebugPerformance === 'always' ||
      (finalDebugPerformance === 'ifFail' && analysis.hasFailed);

    if (shouldLog) {
      logPerformanceResults(url, analysis.results, analysis.hasFailed, analysis.failures);
    }

    if (analysis.hasFailed) {
      expect
        .soft(false, `Performance thresholds not met:\n${analysis.failures.join('\n')}`)
        .toBeTruthy();
    }
  } finally {
    await chrome.kill();
  }
}
