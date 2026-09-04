export const supportedLanguages = ['cpp', 'python', 'javascript', 'typescript', 'java', 'go', 'rust'] as const;
export type SupportedLanguage = (typeof supportedLanguages)[number];

export const languageLabels: Record<SupportedLanguage, string> = {
  cpp: 'C++',
  python: 'Python',
  javascript: 'JavaScript',
  typescript: 'TypeScript',
  java: 'Java',
  go: 'Go',
  rust: 'Rust',
};
