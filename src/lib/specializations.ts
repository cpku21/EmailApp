export const SPECIALIZATIONS = [
  'frontend',
  'backend',
  'fullstack',
  'mobile',
  'devops',
  'data',
  'qa',
] as const;

export type Specialization = (typeof SPECIALIZATIONS)[number];
