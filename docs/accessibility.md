# Accessibility

← [Back to main documentation](../README.md)

## Configuration

Configuration for accessibility testing is defined in `config/accessibilityConfig.ts`. This file allows you to set global preferences for WCAG compliance levels, rules to ignore, and report settings.

**Available tags:**
- `'wcag2a'`       → WCAG 2.0 Level A
- `'wcag2aa'`      → WCAG 2.0 Level AA
- `'wcag21a'`      → WCAG 2.1 Level A
- `'wcag21aa'`     → WCAG 2.1 Level AA
- `'wcag22aa'`     → WCAG 2.2 Level AA
- `'section508'`   → US Section 508 compliance
- `'best-practice'`→ General accessibility best practices

**Example configuration (`config/accessibilityConfig.ts`):**

```ts
const accessibilityConfig = {
  tags: ['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa'],
  ignoredRules: {
    'color-contrast': false,
  },
  reportConsole: {
    impact: true,
    id: true,
    description: false,
    help: true,
    helpUrl: false,
    nodes: true,
  },
  reportsOutputFolder: `${buildDir}/accessibility-reports`,
};
```

**Configuration options:**

- **`tags`**: Array of WCAG/Section 508 compliance levels to test against
- **`ignoredRules`**: Object defining which accessibility rules to ignore (set to `true` to ignore)
- **`reportConsole`**: Controls what information is displayed in console output
- **`reportsOutputFolder`**: Directory where accessibility reports are saved

## Usage

This project uses `axe-core` to run automated accessibility tests. The tests are designed to catch common accessibility issues and ensure compliance with WCAG standards. We provide a helper function `runAccessibilityScan` to simplify running these checks.

**Example usage**

```ts
import { test } from '@playwright/test';
import runAccessibilityScan from '../../utils/accessibility';

test('Homepage accessibility', async ({ page }) => {
  await page.goto('/');
  await runAccessibilityScan(page);
});
```

**Overriding Configuration in Tests**
You can override the default configuration for a specific test by passing an options object to the `runAccessibilityScan` function.

**Example (`tests/accessibility/accessibility.spec.ts`):**

```ts
test('Careers page accessibility', async ({ page }) => {
  await page.goto('/careers');
  await runAccessibilityScan(page, {
    tags: ['best-practice'],
    ignoredRules: {
      'landmark-banner-is-top-level': true,
    },
  });
});
```

**Reports**
After running the tests, two reports are generated in the `build/accessibility-reports` folder:

- `accessibility-report.json`: A detailed JSON file with all violations.
- `accessibility-report.md`: A human-readable Markdown report summarizing the findings.
