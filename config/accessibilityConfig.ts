import { buildDir } from '../global-setup';

const accessibilityConfig = {
  tags: ['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa', 'wcag22aa', 'section508', 'best-practice'],

  ignoredRules: {
    'color-contrast': false,
    'aria-input-field-name': true,
    'nested-interactive': true,
    'landmark-unique': true,
    'heading-order': true,
    'landmark-banner-is-top-level': true,
  },

  reportConsole: {
    impact: true,
    id: true,
    description: false,
    help: true,
    helpUrl: false,
    nodes: true,
  },

  reportsOutputFolder: `${buildDir}/accessibility-reports`,
};

export default accessibilityConfig;
