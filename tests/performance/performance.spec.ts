import { test } from '@playwright/test';
import runPerformanceAudit from '../../utils/performance';
import { PAGES } from '../../data/paths';

test.describe.configure({ timeout: 60000 });

test('Performance audit - Homepage', async ({ page }) => {
  await page.goto(PAGES.HOMEPAGE);
  await runPerformanceAudit(page);
});

test('Performance audit - Careers page', async ({ page }) => {
  await page.goto(PAGES.CAREERS);
  await runPerformanceAudit(page, {
    categories: ['performance'],
    thresholds: { performance: 0.5 },
    formFactor: 'mobile',
  });
});
