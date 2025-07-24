/**
 * Reads a nested value from Playwright config using a dot-separated path string.
 *
 * This function allows you to easily access any value from your Playwright config (e.g. baseURL, users, custom settings)
 * by providing a path like 'baseURL', 'users.admin.username', etc.
 *
 * Example usage:
 *   readConfig('baseURL', testInfo)
 *   readConfig('users.admin.username', testInfo)
 *
 * @param path Dot-separated path to the property, e.g. 'baseURL', 'users.admin.username'
 * @param testInfo The testInfo object provided by Playwright (available inside each test)
 * @returns The value from config or undefined if not found
 */
export function readConfig(path: string, testInfo: any) {
  return path.split('.').reduce((acc, key) => acc?.[key], testInfo.project.use as any);
}
