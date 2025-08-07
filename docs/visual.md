# Visual Testing with Percy

← [Back to main documentation](../README.md)

## Overview

The PlaywrightStarterKit includes integration with [Percy](https://percy.io), a visual testing and review platform that helps you detect visual changes between different versions of your application. Percy captures snapshots of your UI, compares them with previous baselines, and highlights any differences.

## Configuration

### Environment Setup

Percy requires specific environment variables to function correctly. These must be configured in your environment files:

- **`PERCY_TOKEN`**: Authentication token for Percy API access
- **`PERCY_BRANCH`**: Branch name for snapshot comparison (default is your Git branch)

These variables should be added to your environment files in the `env/` directory. For more information on environment configuration, see [Environment Configuration](./environmentConfig.md#environment-variables-and-secrets).

Example `.env` file entry:
```dotenv
PERCY_TOKEN=xyz123...
PERCY_BRANCH=main
```

> **Note:** The test runner script automatically injects the `PERCY_TOKEN` from your environment file when running visual tests.

### Branch Selection

The `PERCY_BRANCH` setting determines which baseline snapshots will be used for comparison:

- When set to `main` (or your main branch), snapshots will be compared against the baseline from your main branch
- When set to a feature branch name, snapshots will be compared against the baseline from that specific branch
- You can use branch names to isolate visual changes specific to a feature or component

This allows you to maintain different baselines for different development streams and compare against the appropriate reference.

## Usage

### Basic Usage

```typescript
import { test } from '@playwright/test';
import percySnapshot from '@percy/playwright';

test('Homepage visual test', async ({ page }) => {
  await page.goto('/');
  // Take a snapshot and send it to Percy
  await percySnapshot(page, 'Homepage');
});
```

### Running Visual Tests

Visual tests are located in the `tests/visual/` directory and can be run using:

```bash
npm run pw:test [environment] visual
```

### Snapshot Naming

Use descriptive names for snapshots to easily identify them in the Percy dashboard:

```typescript
await percySnapshot(page, 'Product Page - Default State');
await page.click('.expanded-view-button');
await percySnapshot(page, 'Product Page - Expanded View');
```

### Responsive Testing

You can test how your UI appears at different screen sizes by specifying widths:

```typescript
await percySnapshot(page, 'Responsive Homepage', { widths: [375, 768, 1280] });
```

### Handling Lazy Loading

For pages with lazy-loaded content, ensure all elements are loaded before taking snapshots:

```typescript
test('Page with lazy loading', async ({ page }) => {
  await page.goto('/');
  // Scroll to load lazy content
  await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
  // Wait for network to be idle after scrolling
  await waitForPageIdle(page);
  await percySnapshot(page, 'Fully Loaded Page');
});
```

### Ignoring Elements

You can exclude specific elements from snapshot comparisons using Percy's CSS option:

```typescript
await percySnapshot(page, 'Page with ignored elements', {
  percyCSS: `
    // Hide dynamic ads
    .ad-container { display: none !important; }
    // Hide timestamps
    .timestamp { visibility: hidden !important; }
    // Hide iframes
    iframe { display: none !important; }
  `
});
```

### Handling Dynamic Content

For dynamic content that changes between test runs (like dates or random images):

```typescript
// Replace dynamic text using the framework's replaceText utility
import { replaceText } from '../utils/replaceText';

test('Page with dynamic content', async ({ page }) => {
  await page.goto('/dashboard');
  await waitForPageIdle(page);
  
  // Replace dynamic date with static text
  await replaceText(page, '.current-date', 'January 1, 2025');
  
  // Replace random image with stable one
  await page.evaluate(() => {
    document.querySelector('.random-image').setAttribute('src', 'https://stable-image-url.com/image.jpg');
  });
  
  await percySnapshot(page, 'Dashboard with stabilized content');
});
```

### CLI vs GUI Mode

**Note:** Percy only captures screenshots when running tests through the command line. It will not capture screenshots when running tests in Playwright's UI mode.

## Best Practices

1. **Ensure Page Stability**: Always use `waitForPageIdle` before taking snapshots to ensure the page is fully loaded
   ```typescript
   import { waitForPageIdle } from '../utils/waitForPageIdle';
   
   test('Homepage visual test', async ({ page }) => {
     await page.goto('/');
     await waitForPageIdle(page); // Ensures page is fully loaded and stable
     await percySnapshot(page, 'Homepage');
   });
   ```

2. **Snapshot Critical UI Elements**: Focus on important UI components rather than entire pages
3. **Stable Test Data**: Ensure tests use consistent data to avoid false visual differences
4. **Handle Dynamic Content**: Use CSS to hide dynamic content (dates, random images) that would cause false positives
5. **Review Changes Promptly**: Regularly check the Percy dashboard for visual changes that need approval
6. **Descriptive Naming**: Use clear, specific names for snapshots to make reviews easier
7. **Branch Management**: Use appropriate branch settings to isolate visual changes to features

## Viewing Results

After running visual tests, you can view the results in your Percy dashboard:

1. Log in to [Percy](https://percy.io)
2. Navigate to your project
3. Review builds to see visual changes

When differences are detected:
- Green indicates approved changes
- Red indicates unapproved changes that need review
- You can approve or reject changes directly in the dashboard

## Advanced Configuration

For advanced Percy configuration options, you can create a `.percy.yml` file in your project root. See the [Percy documentation](https://docs.percy.io/docs/configuration) for more details.
