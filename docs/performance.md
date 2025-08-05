# Performance

← [Back to main documentation](../README.md)

## Configuration

Configuration for performance testing is defined in `config/performanceConfig.ts`. This file controls Lighthouse audit settings, thresholds, and report generation options.

**Available categories:**
- `'performance'`     → Core Web Vitals and loading metrics
- `'accessibility'`   → Accessibility audit within Lighthouse
- `'best-practices'`  → General web development best practices
- `'seo'`            → Search Engine Optimization checks
- `'pwa'`            → Progressive Web App compliance

**Example configuration (`config/performanceConfig.ts`):**

```ts
const performanceConfig = {
  categories: [
    { name: 'performance', enabled: true },
    { name: 'accessibility', enabled: true },
    { name: 'best-practices', enabled: true },
    { name: 'seo', enabled: true },
    { name: 'pwa', enabled: false },
  ],

  thresholds: {
    performance: 0.4,
    accessibility: 0.95,
    'best-practices': 0.8,
    seo: 0.8,
    pwa: 0.5,
  },

  debugPerformance: 'ifFail', // 'always' | 'never' | 'ifFail'
  formFactor: 'desktop', // 'desktop' | 'mobile'
  reportsOutputFolder: `${buildDir}/performance-reports`,
};
```

**Configuration options:**

- **`categories`**: Array defining which Lighthouse categories to test and their enabled status
- **`thresholds`**: Score requirements for each category (0-1 scale, where 1.0 = 100%)
- **`debugPerformance`**: Controls console logging behavior:
  - `'always'`: log all performance results
  - `'never'`: disable logging
  - `'ifFail'`: log only when thresholds are not met
- **`formFactor`**: Default device type for emulation (`'desktop'` or `'mobile'`)
- **`formFactorConfigs`**: Screen emulation settings for different device types
- **`lighthouseOptions`**: Additional Lighthouse configuration options
- **`chromeFlags`**: Chrome browser flags used during audit
- **`reportsOutputFolder`**: Directory where performance reports are saved

## Usage

This project uses Google Lighthouse to run performance audits and measure Core Web Vitals. The tests generate both HTML and JSON reports and compare results against configurable thresholds. We provide a helper function `runPerformanceAudit` to simplify running these audits.

**Example usage**

```ts
import { test } from '@playwright/test';
import runPerformanceAudit from '../utils/performance';

test('Performance audit for homepage', async ({ page }) => {
  await page.goto('https://www.example.com');
  await runPerformanceAudit(page);
});
```

**Advanced usage with overrides**

```ts
import { test } from '@playwright/test';
import runPerformanceAudit from '../utils/performance';

test('Mobile performance audit with custom thresholds', async ({ page }) => {
  await page.goto('https://www.example.com/products');
  
  await runPerformanceAudit(page, {
    categories: ['performance'],
    thresholds: { performance: 0.90 },
    formFactor: 'mobile',
    debugPerformance: 'always'
  });
});
```

**Override options:**

- **`categories`**: Override which Lighthouse categories to test
- **`thresholds`**: Override score requirements for specific categories
- **`formFactor`**: Force desktop or mobile emulation for this test
- **`debugPerformance`**: Override logging behavior for this test
- **`chromeFlags`**: Override Chrome browser flags
- **`onlyAudits`**: Run only specific Lighthouse audits (advanced usage)

## Reports

Performance audits generate two types of reports in the `build/performance-reports/` directory:

- **HTML reports**: Interactive Lighthouse reports viewable in browser
- **JSON reports**: Raw audit data for programmatic analysis

Report filenames include the URL, form factor, and timestamp:
```
www.example.com_[desktop]_2025-08-05_17-13-28.html
www.example.com_[desktop]_2025-08-05_17-13-28.json
```

## Measured Metrics

The performance category includes Core Web Vitals and other important metrics:

- **First Contentful Paint (FCP)**: Time until first content appears
- **Largest Contentful Paint (LCP)**: Time until largest content element loads
- **Cumulative Layout Shift (CLS)**: Visual stability during loading
- **Total Blocking Time (TBT)**: Responsiveness during loading
- **Speed Index**: How quickly content is visually displayed

## Best Practices

1. **Run performance tests on stable pages**: Avoid testing during active development
2. **Use realistic test data**: Test with production-like content and data volumes
3. **Consider network conditions**: Tests run in optimal conditions by default
4. **Set appropriate thresholds**: Balance realistic expectations with performance goals
5. **Test both desktop and mobile**: Use different form factors for comprehensive coverage
6. **Review failed audits**: HTML reports provide detailed optimization recommendations
