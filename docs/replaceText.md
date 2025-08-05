# Replace Text

← [Back to main documentation](../README.md)

## Overview

The `replaceText` utility function allows you to replace the text content of elements on a page. This is useful when you need to modify text in elements that cannot be easily changed through standard input methods (spans, divs, etc.).

## Usage

```typescript
import replaceText from '../utils/replaceText';

test('Replace text in elements', async ({ page }) => {
  await page.goto('https://example.com');
  
  // Replace text using CSS selector
  await replaceText(page, '.price', '$99.99');
  
  // Replace text using Playwright locator
  const titleLocator = page.locator('h1.main-title');
  await replaceText(page, titleLocator, 'Updated Title');
});
```

## Parameters

- **`page`** (`Page`) - The Playwright page object
- **`selector`** (`string | Locator`) - CSS selector string or Playwright locator
- **`text`** (`string`) - The new text content for all matching elements

## Examples

```typescript
// Single element
await replaceText(page, '#product-price', '$49.99');

// Multiple elements
await replaceText(page, '.status-indicator', 'Online');

// With locator
const button = page.getByRole('button', { name: 'Submit' });
await replaceText(page, button, 'Send Form');
```

## Limitations

- Only replaces `textContent`, not HTML content
- Does not trigger DOM events associated with text changes
- May not work with elements that have complex text rendering
