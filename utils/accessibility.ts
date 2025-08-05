import { Page, expect } from '@playwright/test';
import { AxeBuilder } from '@axe-core/playwright';
import accessibilityConfig from '../config/accessibilityConfig';
import { generateAccessibilityReport } from './accessibilityReport';
import { AxeResults } from 'axe-core';

type AccessibilityOverride = {
  tags?: string[];
  ignoredRules?: Record<string, boolean>;
};

/**
 * Runs an automated accessibility scan on the current page using axe-core.
 * This function performs WCAG compliance checks and generates detailed reports
 * of any accessibility violations found.
 *
 * @param page - The Playwright page object to scan for accessibility issues
 * @param override - Optional configuration to override default accessibility settings
 * @param override.tags - WCAG tags to test against (completely replaces config defaults)
 * @param override.ignoredRules - Rules to ignore during scan (merged with config defaults)
 *
 * @throws {Error} Throws an assertion error if any accessibility violations are found
 *
 * @example
 * ```typescript
 * // Complete test example
 * test('Homepage accessibility', async ({ page }) => {
 *   await page.goto('/');
 *   await runAccessibilityScan(page, {
 *     tags: ['wcag2a', 'wcag2aa'],
 *     ignoredRules: {
 *       'landmark-banner-is-top-level': true
 *     }
 *   });
 * });
 * ```
 *
 * @remarks
 * - Uses configuration from `accessibilityConfig.ts` as defaults
 * - Generates reports in `build/accessibility-reports/` directory
 * - Available WCAG tags: 'wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa', 'wcag22aa', 'section508', 'best-practice'
 * - Override tags completely replace config defaults
 * - Override ignoredRules are merged with (added to) config defaults
 * - Test will fail if any accessibility violations are found
 */
export default async function runAccessibilityScan(
  page: Page,
  override?: AccessibilityOverride
): Promise<void> {
  const configTags: string[] = accessibilityConfig.tags ?? [];
  const configIgnoredRules: Record<string, boolean> = accessibilityConfig.ignoredRules ?? {};

  const finalTags: string[] =
    override?.tags && override.tags.length > 0 ? override.tags : configTags;

  const mergedIgnoredRules: Record<string, boolean> = {
    ...configIgnoredRules,
    ...(override?.ignoredRules ?? {}),
  };

  const disabledRules: string[] = Object.entries(mergedIgnoredRules)
    .filter(([_, ignore]) => ignore)
    .map(([ruleName]) => ruleName);

  const results: AxeResults = await new AxeBuilder({ page })
    .withTags(finalTags)
    .disableRules(disabledRules)
    .analyze();

  generateAccessibilityReport(results, accessibilityConfig, page.url());

  expect(results.violations.length, `Accessibility violations on ${page.url()}`).toBe(0);
}
