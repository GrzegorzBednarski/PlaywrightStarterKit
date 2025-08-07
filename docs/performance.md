# Performance

← [Back to main documentation](../README.md)

## Overview

The PlaywrightStarterKit includes built-in performance testing capabilities using Lighthouse. This allows you to measure Core Web Vitals and other critical metrics as part of your automated testing pipeline.

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
  
  formFactorConfigs: {
    desktop: {
      formFactor: 'desktop',
      screenEmulation: {
        mobile: false,
        width: 1920,
        height: 1080,
      }
    },
    mobile: {
      formFactor: 'mobile',
      screenEmulation: {
        mobile: true,
        width: 375,
        height: 667,
      }
    }
  },
  
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
- **`formFactorConfigs`**: Screen emulation settings for different device types:
  - `formFactor`: Type of device to emulate
  - `screenEmulation`: Screen dimensions and mobile flag settings
- **`reportsOutputFolder`**: Directory where performance reports are saved

## Usage

The framework provides utilities to run Lighthouse audits within your Playwright tests.

### Basic Usage

```typescript
import { test } from '@playwright/test';
import { runPerformanceAudit } from '../utils/performance';

test('Homepage performance meets thresholds', async ({ page }) => {
  await page.goto('/');
  await runPerformanceAudit(page, 'homepage');
});
```

### Running Performance Tests

Performance tests are located in the `tests/performance/` directory and can be run using:

```bash
npm run pw:test [environment] performance
```

### Custom Thresholds

You can override global thresholds for specific tests:

```typescript
test('Page with custom thresholds', async ({ page }) => {
  await page.goto('/heavy-page');
  
  await runPerformanceAudit(page, 'heavy-page', {
    thresholds: {
      performance: 0.3,  // Lower threshold for this specific page
      accessibility: 0.9
    }
  });
});
```

You can also customize other performance configuration options for specific tests:

```typescript
test('Page with custom performance configuration', async ({ page }) => {
  await page.goto('/complex-page');
  
  await runPerformanceAudit(page, 'complex-page', {
    thresholds: {
      performance: 0.4,
      'best-practices': 0.75
    },
    formFactor: 'mobile',  // Override the default form factor
    categories: [
      { name: 'performance', enabled: true },
      { name: 'best-practices', enabled: true },
      { name: 'accessibility', enabled: false },  // Disable accessibility checks for this test
      { name: 'seo', enabled: false }
    ],
    debugPerformance: 'always'  // Always show performance results for this test
  });
});
```

### Viewing Reports

Performance test reports are generated in the `build/performance-reports` directory (or custom location defined in config). HTML reports include detailed metrics and suggestions for improvement.

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
