module.exports = {
  environments: {
    example: { env: 'example', project: 'EXAMPLE' },
  },
  testTypes: {
    accessibility: ['tests/accessibility'],
    analytics: ['tests/analytics'],
    functional: ['tests/functional'],
    performance: ['tests/performance'],
    visual: ['tests/visual'],
  },
  testGroups: {
    all: ['accessibility', 'analytics', 'functional'],
  },
  grepGroups: {
    sanity: '[sanity]',
    smoke: '[smoke]',
  },
  grepExclude: ['performance', 'visual'],
  reportPath: 'build/html-report',
};
