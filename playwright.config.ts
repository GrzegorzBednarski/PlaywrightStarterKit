import { defineConfig } from '@playwright/test';
import * as fs from 'fs';
import * as path from 'path';

const ENV = process.env.ENV;
if (!ENV) {
  throw new Error(
    'No ENV variable provided! Please set ENV to the desired environment (e.g. ENV=dev) when running Playwright. See README, section: Environment configuration.'
  );
}
const envPath = path.resolve(__dirname, `env/.${ENV}.json`);

let envConfig: any = {};
if (fs.existsSync(envPath)) {
  envConfig = JSON.parse(fs.readFileSync(envPath, 'utf-8'));
} else {
  throw new Error(
    `Environment file not found: ${envPath}. Please create the file or set ENV to a valid environment. See README, section: Environment configuration.`
  );
}

const baseConfig = {
  timeout: 5000,
};

const mergedConfig = {
  ...baseConfig,
  ...envConfig,
  use: {
    ...baseConfig.use,
    ...(envConfig.use || {}),
    baseURL: envConfig?.baseURL || baseConfig.use.baseURL,
  },
};

export default defineConfig(mergedConfig);
