import { Page, expect } from '@playwright/test';
import { AxeBuilder } from '@axe-core/playwright';
import accessibilityConfig from '../config/accessibilityConfig';
import { generateAccessibilityReport } from './accessibilityReport';
import { AxeResults } from 'axe-core';

type AccessibilityOverride = {
  tags?: string[];
  ignoredRules?: Record<string, boolean>;
};

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
