import { Page, Route } from '@playwright/test';
import { loadFixtureWithReplacements } from './fixtures';

type InterceptOptions = {
  method?: string;
  statusCode?: number;
  replacements?: Record<string, string | number>;
};

function wildcardToRegExp(wildcard: string): RegExp {
  const escaped = wildcard.replace(/[-/\\^$+?.()|[\]{}]/g, '\\$&'); // escape regex chars
  const regexString = '^' + escaped.replace(/\*/g, '.*') + '$';
  return new RegExp(regexString);
}

/**
 * Intercepts HTTP requests matching a URL pattern and responds with data from a fixture file.
 *
 * @param page - The Playwright page object to attach the route interceptor to
 * @param urlPattern - URL pattern to match (string with wildcards * or RegExp)
 * @param fixtureName - Name of the fixture file in the intercepts directory (e.g., 'products.json')
 * @param options - Optional configuration object
 * @param options.method - HTTP method to intercept (default: 'GET')
 * @param options.statusCode - HTTP status code to return (default: 200)
 * @param options.replacements - Object with placeholder-value pairs for dynamic replacement
 *
 * @example
 * ```typescript
 * await interceptWithFixture(
 *   page,
 *   'INTERCEPTS.PUBLIC_TRAINING_LIBRARY',
 *   'courses.json',
 *   {
 *     method: 'GET',
 *     statusCode: 200,
 *     replacements: { '%TODAY%': new Date().toLocaleDateString() }
 *   }
 * );
 * ```
 */
export async function interceptWithFixture(
  page: Page,
  urlPattern: string | RegExp,
  fixtureName: string,
  options?: InterceptOptions
) {
  const { method = 'GET', statusCode = 200, replacements = {} } = options || {};

  const fullFixturePath = `intercepts/${fixtureName}`;
  const fixtureData = loadFixtureWithReplacements(fullFixturePath, replacements);

  const finalUrlPattern =
    typeof urlPattern === 'string' ? wildcardToRegExp(urlPattern) : urlPattern;

  await page.route(finalUrlPattern, async (route: Route) => {
    const request = route.request();
    if (request.method() !== method) {
      return route.continue();
    }

    await route.fulfill({
      status: statusCode,
      contentType: 'application/json',
      body: JSON.stringify(fixtureData),
    });
  });
}
