// global-setup.ts
import * as fs from 'fs-extra';

export const buildDir = 'build';

export default async function globalSetup() {
  if (fs.existsSync(buildDir)) {
    console.log(`Removing ${buildDir} directory before tests...`);
    fs.removeSync(buildDir);
  }
}
