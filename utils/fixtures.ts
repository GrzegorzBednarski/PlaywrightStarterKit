import * as fs from 'fs';
import * as path from 'path';

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
