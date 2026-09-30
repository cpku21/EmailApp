const l = {
  metadata: {
    title: 'EmailApp | Remote Programming Companies',
    description:
      'Discover remote programming and IT companies that hire across Europe.',
  },
  home: {
    appName: 'EmailApp',
    eyebrow: 'Remote companies. Direct contacts.',
    heroTitle: 'Choose your specialty.',
    heroHighlight: 'Get up to 200 company emails for direct applications.',
    heroDescription:
      'Filter remote programming employers hiring across Europe and start reaching out in minutes.',
    loadError: 'We could not load companies right now. Please try again later.',
    footer: 'EmailApp — remote programming companies hiring across Europe.',
  },
  filters: {
    specialization: 'Specialization',
    allSpecializations: 'All specializations',
    region: 'Region',
    anyRegion: 'Any region',
    eu: 'EU',
    europe: 'Europe',
    countries: 'Countries',
    submit: 'Show companies',
  },
  companies: {
    sectionLabel: 'Companies',
    empty: 'No companies match these filters',
  },
} as const;

export default l;
export type Language = typeof l;
