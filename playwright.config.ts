import { defineConfig } from '@playwright/test';
import './config/dotenv';

export default defineConfig({
  timeout: 8000,
  use: {
    baseURL: 'https://example.com',
  },
  projects: [
    {
      name: 'EXAMPLE',
      timeout: 10000,
      use: {
        baseURL: 'https://www.vml.com',
      },
    },
  ],
});
