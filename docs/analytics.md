# Analytics

← [Back to main documentation](../README.md)

## Overview

The PlaywrightStarterKit includes tools for testing analytics implementations by capturing and validating events sent to data layers (Google Analytics, Adobe Analytics, etc.). This allows you to ensure that user interactions correctly trigger the expected tracking events.

## Configuration

Configuration for analytics testing is defined in `config/analyticsConfig.ts`.
This file controls how analytics events are captured and filtered during tests.

**Example configuration (`config/analyticsConfig.ts`):**

```ts
export const analyticsConfig = {
  source: 'dataLayer', // name of the global array used for analytics (e.g., adobeDataLayer, dataLayer, gtag)
  debugAnalytics: 'ifFail', // 'always' | 'never' | 'ifFail'
  enableFiltering: true,
  filterKey: 'consent', // 'key' | 'value' | 'key:value'
};
```

**Configuration options:**

- **`source`**: The global JavaScript object or array where analytics events are pushed (e.g., `dataLayer` for Google Tag Manager, `adobeDataLayer` for Adobe)
- **`debugAnalytics`**: Controls console logging behavior:
  - `'always'`: Log all captured analytics events
  - `'never'`: Disable logging
  - `'ifFail'`: Log only when event validation fails
- **`enableFiltering`**: When true, only events matching the `filterKey` pattern will be captured
- **`filterKey`**: Pattern used to filter analytics events:
  - Simple string: Matches any object containing this key or value
  - `'key:value'` format: Matches objects where the specified key has the specified value

## Usage

The framework provides utility functions to capture and validate analytics events in your tests.

### Basic Usage

```typescript
import { test } from '@playwright/test';
import { initAnalyticsSpy, checkAnalyticsEvent } from '../utils/analytics';

test('Homepage view triggers correct page view event', async ({ page }) => {
  // Navigate to the page
  await page.goto('/');
  
  // Initialize the analytics spy (must be done after page load)
  await initAnalyticsSpy(page);
  
  // Perform action that should trigger analytics
  await page.click('.cookie-accept-button');
  
  // Verify the correct event was fired
  await checkAnalyticsEvent(page, 'acceptAllCookiesButtonClick');
});
```

### Analytics Fixtures

Expected analytics events are defined as fixtures in the `fixtures/analytics/` directory. Each fixture is a JSON file containing the expected event structure:

```json
{
  "event": "buttonClick",
  "eventType": "interaction",
  "eventCategory": "cookie",
  "eventAction": "accept_all",
  "timestamp": 1634567890123
}
```

When calling `checkAnalyticsEvent(page, 'fixtureId')`, the function will:

1. Load the fixture file named `fixtureId.json`
2. Compare the captured events against the expected event structure
3. Pass the test if a matching event is found, or fail with details about the mismatch

### Advanced Usage

#### Custom Timeout

You can specify a custom timeout for waiting for analytics events:

```typescript
// Wait up to 5 seconds for the analytics event
await checkAnalyticsEvent(page, 'loginButtonClick', { timeout: 5000 });
```

#### Dynamic Event Data

You can override values from fixture files for dynamic or variable data:

```typescript
await initAnalyticsSpy(page);
await page.fill('#search', 'playwright testing');
await page.click('#search-button');

// Override the 'searchTerm' property in the fixture with the actual value
await checkAnalyticsEvent(page, 'searchEvent', { 
  overrideValues: {
    searchTerm: 'playwright testing',
    timestamp: expect.any(Number)  // Use matcher for dynamic timestamps
  }
});
```

In this example, the test will use the fixture file `fixtures/analytics/searchEvent.json` but replace the `searchTerm` value with "playwright testing" and use a matcher for the timestamp field, which might be different on each test run.

#### Multiple Events

To check for a sequence of events:

```typescript
await initAnalyticsSpy(page);
await page.click('#login');
await checkAnalyticsEvent(page, 'loginButtonClick');

await page.fill('#username', 'user@example.com');
await checkAnalyticsEvent(page, 'formInteraction');
```

### Running Analytics Tests

Analytics tests are located in the `tests/analytics/` directory and can be run using:

```bash
npm run pw:test [environment] analytics
```
