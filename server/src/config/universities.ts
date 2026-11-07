export const UNIVERSITIES = [
  "Harvard University",
  "Stanford University",
  "Massachusetts Institute of Technology",
  "Columbia University",
  "University of Texas at Austin",
] as const;

export type University = (typeof UNIVERSITIES)[number];