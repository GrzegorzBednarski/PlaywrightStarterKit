import * as fs from 'fs';
import * as path from 'path';

/**
 * Loads a JSON fixture file and applies dynamic replacements to its content.
 *
 * @param relativePath - Path to the fixture file relative to the fixtures directory (e.g., 'intercepts/products.json')
 * @param replacements - Optional object containing placeholder-value pairs for replacement (e.g., { '%TODAY%': '2025-01-04' })
 * @returns The parsed JSON object with all placeholders replaced by their corresponding values
 *
 * @example
 * ```typescript
 * const data = loadFixtureWithReplacements('intercepts/courses.json', {
 *   '%USER_ID%': '12345',
 *   '%DATE%': new Date().toISOString()
 * });
 * ```
 */
export function loadFixtureWithReplacements(
  relativePath: string,
  replacements?: Record<string, string | number>
) {
  const filePath = path.join(__dirname, '..', 'fixtures', relativePath);
  const raw = fs.readFileSync(filePath, 'utf-8');
  const json = JSON.parse(raw);

  const applyReplacements = (obj: any) => {
    if (Array.isArray(obj)) {
      obj.forEach(item => applyReplacements(item));
    } else if (typeof obj === 'object' && obj !== null) {
      for (const key in obj) {
        if (typeof obj[key] === 'object') {
          applyReplacements(obj[key]);
        } else if (typeof obj[key] === 'string') {
          for (const [placeholder, value] of Object.entries(replacements || {})) {
            if (obj[key].includes(placeholder)) {
              obj[key] = obj[key].replace(placeholder, String(value));
            }
          }
        }
      }
    }
  };

  applyReplacements(json);
  return json;
}
