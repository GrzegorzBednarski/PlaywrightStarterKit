# Analytics

← [Back to main documentation](../README.md)

## Configuration

Configuration for analytics spying is defined in `config/analyticsConfig.ts`.
This file controls how analytics events are captured and filtered during tests.

**Example structure:**

```ts
export const analyticsConfig = {
  source: 'dataLayer', // name of the global array used for analytics (e.g., adobeDataLayer, dataLayer, gtag)
  debugAnalytics: 'ifFail', // 'always' | 'never' | 'ifFail'
  enableFiltering: true,
  filterKey: 'event:pageEvent', // 'key' | 'value' | 'key:value'
};
```

- **source**: name of the global array (e.g., `dataLayer`) where events are pushed.
- **debugAnalytics**: controls logging behavior:
  - `'always'`: log all matching events
  - `'never'`: disable logging
  - `'ifFail'`: log only when `checkAnalyticsEvent` fails
- **enableFiltering**: whether to filter events using `filterKey`
- **filterKey**: string used to match events (e.g., `event:pageEvent`)

## Usage

We provide two helper functions to verify if analytics events are correctly pushed to the data layer.

The first function, `initAnalyticsSpy`, injects a spy into the page and starts capturing analytics events. It should be called before any user interactions that trigger analytics.

The second function, `checkAnalyticsEvent`, compares the captured events with the expected result defined in a fixture file.

**Example usage**

```ts
import { test } from '@playwright/test';
import { initAnalyticsSpy, checkAnalyticsEvent } from './helpers/analytics';

test('Check analytics after clicking the logo', async ({ page }) => {
  await page.goto('http://www.example.com');
  await initAnalyticsSpy(page);
  await page.locator('#logo').click();
  await checkAnalyticsEvent(page, 'clicks/logo');
});
```

In the example above, we first navigate to the page and initialize the analytics spy. Then we perform an action (clicking the logo), and finally verify that the expected analytics event was captured.

**Example fixture file**
Located under `fixtures/analytics/clicks/logo.json`:

```json
{
  "event": "pageEvent",
  "actionType": "click",
  "clickType": "internal",
  "pageElement": {
    "siteSection": "MastHead TopNav",
    "elementLayer1": "top-navigation",
    "elementLayer2": "image",
    "itemIdentifier": "Brand logo"
  }
}
```

**Dynamic placeholders**
If your expected analytics event contains dynamic values (e.g., URL or element name), you can use placeholders in the fixture file and pass replacements to `checkAnalyticsEvent`.

**Example fixture file with placeholders:**

```json
{
  "event": "pageEvent",
  "actionType": "click",
  "clickType": "internal",
  "pageElement": {
    "siteSection": "MastHead MegaMenu",
    "elementLayer1": "snippet reference-megamenu-v2-tablet-variant-disabled",
    "elementLayer2": "megamenu",
    "elementLayer3": "richtext",
    "itemIdentifier": "%NAME%",
    "internalDestination": "%URL%"
  }
}
```

**Example usage with replacements:**

```ts
test('Check analytics after clicking dynamic link', async ({ page }) => {
  const link = page.locator('a.dynamicTitle');
  const url = await link.getAttribute('href');
  const title = await link.textContent();

  await checkAnalyticsEvent(page, 'clicks/dynamic-title', {
    '%URL%': url!,
    '%NAME%': title!,
  });
});
```

In this example, we extract dynamic values from the page and pass them as replacements to match the expected analytics event.
