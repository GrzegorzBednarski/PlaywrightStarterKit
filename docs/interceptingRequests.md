# Intercepting requests with fixtures

← [Back to main documentation](../README.md)

In addition to the features described above, this project includes a custom utility function for intercepting HTTP requests and responding with data from a fixture file. This can be useful for testing different server responses without having to modify your backend.

## Configuration

First, define your URL patterns in `data/intercepts.ts`:

```typescript
export const INTERCEPTS = {
  PUBLIC_TRAINING_LIBRARY: '*/api/public/*/training/library*',
  PUBLIC_TRAINING_LIBRARY_REGEXP: /\/api\/public\/.*\/training\/library/,
};
```

You can use either:
- **String patterns with wildcards** (`*`) - these will be automatically converted to RegExp
- **Direct RegExp patterns** - for more complex matching

## Fixture files

Create your response data in `fixtures/intercepts/` directory. For example, create `fixtures/intercepts/trainingLibrary.json`:

```json
{
  "data": [
    {
      "id": "course-123",
      "title": "Introduction to Testing - %TODAY_DATE%",
      "type": "Course",
      "duration": "30 minutes"
    },
    {
      "id": "path-456", 
      "title": "Advanced Learning Path",
      "type": "LearningPath",
      "duration": "2 hours"
    }
  ],
  "totalCount": 2
}
```

Note the `%TODAY_DATE%` placeholder - this can be dynamically replaced in your tests.

## Usage in tests

The `interceptWithFixture` function takes the following parameters:
- `page`: The Playwright page object
- `urlPattern`: URL pattern (string with wildcards or RegExp) 
- `fixtureName`: Path to the fixture file (with .json extension)
- `options`: Optional configuration object with the following properties:
  - `method`: HTTP method to intercept (default: 'GET')
  - `statusCode`: HTTP status code to return (default: 200)
  - `replacements`: Object with dynamic value replacements

Here's an example of how to use this in your tests:

```typescript
import { test, expect } from '@playwright/test';
import { interceptWithFixture } from '../../utils/interceptWithFixture';
import { INTERCEPTS } from '../../data/intercepts';

test('should display mocked training courses', async ({ page }) => {
  const today = new Date().toLocaleDateString('en-US');
  
  await interceptWithFixture(
    page,
    INTERCEPTS.PUBLIC_TRAINING_LIBRARY_REGEXP,
    'trainingLibrary.json',
    {
      replacements: { '%TODAY_DATE%': today }
    }
  );

  await page.goto('/training-library');
  
  // Verify the mocked data appears with today's date
  await expect(page.locator('h3').filter({ hasText: `Introduction to Testing - ${today}` })).toBeVisible();
  await expect(page.locator('h3').filter({ hasText: 'Advanced Learning Path' })).toBeVisible();
});
```

## Advanced usage examples

You can also intercept different HTTP methods and return different status codes:

```typescript
// Intercept POST request and return 201 Created
await interceptWithFixture(
  page,
  INTERCEPTS.COURSE_ENROLLMENT,
  'enrollmentSuccess.json',
  {
    method: 'POST',
    statusCode: 201,
    replacements: { 
      '%USER_ID%': '12345',
      '%ENROLLMENT_DATE%': new Date().toISOString()
    }
  }
);

// Intercept and return error response
await interceptWithFixture(
  page,
  INTERCEPTS.USER_PROFILE,
  'userNotFound.json',
  {
    method: 'GET',
    statusCode: 404
  }
);
```

In this example, we're intercepting requests to the training library API and responding with data from the `trainingLibrary.json` fixture file. The `%TODAY_DATE%` placeholder in the fixture is dynamically replaced with the current date.

**Note:** The fixture file path is relative to the `fixtures/intercepts/` directory and must include the `.json` extension.
