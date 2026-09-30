export const EU_COUNTRIES = [
  'AT',
  'BE',
  'BG',
  'CY',
  'CZ',
  'DE',
  'DK',
  'EE',
  'ES',
  'FI',
  'FR',
  'GR',
  'HR',
  'HU',
  'IE',
  'IT',
  'LT',
  'LU',
  'LV',
  'MT',
  'NL',
  'PL',
  'PT',
  'RO',
  'SE',
  'SI',
  'SK',
] as const;

export const OTHER_EUROPEAN_COUNTRIES = [
  'AL',
  'AD',
  'BA',
  'CH',
  'GB',
  'IS',
  'LI',
  'MC',
  'MD',
  'ME',
  'MK',
  'NO',
  'RS',
  'SM',
  'UA',
  'VA',
] as const;

export function resolveRegion(region: string): string[] {
  const normalizedRegion = region.toUpperCase();

  if (normalizedRegion === 'EU') {
    return [...EU_COUNTRIES];
  }

  if (normalizedRegion === 'EUROPE') {
    return [...EU_COUNTRIES, ...OTHER_EUROPEAN_COUNTRIES];
  }

  return [normalizedRegion];
}
