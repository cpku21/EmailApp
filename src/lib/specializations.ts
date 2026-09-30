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

export const SPECIALIZATION_LABELS: Record<Specialization, string> = {
  frontend: 'Frontend',
  backend: 'Backend',
  fullstack: 'Full-stack',
  mobile: 'Mobile',
  devops: 'DevOps',
  data: 'Data',
  qa: 'QA',
};
