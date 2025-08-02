export const analyticsConfig = {
  source: 'dataLayer',
  debugAnalytics: 'ifFail', // 'always' | 'never' | 'ifFail'
  enableFiltering: true,
  filterKey: 'consent', // 'key' | 'value' | 'key:value'
} as const;
