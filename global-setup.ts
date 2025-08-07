import * as fs from 'fs-extra';

export const buildDir = 'build';

export default async function globalSetup() {
  if (fs.existsSync(buildDir)) {
    fs.removeSync(buildDir);
  }
}
