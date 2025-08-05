import { buildDir } from '../global-setup';

const performanceConfig = {
  categories: [
    { name: 'performance', enabled: true },
    { name: 'accessibility', enabled: true },
    { name: 'best-practices', enabled: true },
    { name: 'seo', enabled: true },
    { name: 'pwa', enabled: false },
  ],

  thresholds: {
    performance: 0.4,
    accessibility: 0.95,
    'best-practices': 0.8,
    seo: 0.8,
    pwa: 0.5,
  },

  // Console logging for performance results
  debugPerformance: 'ifFail', // 'always' | 'never' | 'ifFail'

  formFactor: 'desktop', // 'desktop' | 'mobile'

  formFactorConfigs: {
    desktop: {
      formFactor: 'desktop' as const,
      screenEmulation: {
        mobile: false,
        width: 1920,
        height: 1080,
        deviceScaleFactor: 1,
      },
    },
    mobile: {
      formFactor: 'mobile' as const,
      screenEmulation: {
        mobile: true,
        width: 375,
        height: 667,
        deviceScaleFactor: 2,
      },
    },
  },

  lighthouseOptions: {
    logLevel: 'silent' as const,
  },

  chromeFlags: ['--headless', '--no-sandbox', '--disable-dev-shm-usage'],

  reportsOutputFolder: `${buildDir}/performance-reports`,
};

export default performanceConfig;
