import * as fs from 'fs';
import * as path from 'path';

/**
 * Loads a JSON fixture file and replaces specified placeholders with given values.
 *
 * @example
 * const data = loadFixtureWithReplacements('example', {
 *   '%key1%': 'value1',
 *   '%key2%': 42
 * });
 *
 * @param {string} relativePath - Relative path to the fixture file (without .json extension)
 * @param {Record<string, string | number>} [replacements] - Key-value pairs to replace in the fixture
 * @returns {any} - The parsed and modified JSON object
 */
export function loadFixtureWithReplacements(
  relativePath: string,
  replacements?: Record<string, string | number>
) {
  const filePath = path.join(__dirname, '..', 'fixtures', relativePath + '.json');
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
