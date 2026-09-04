import { codeToHtml } from 'shiki';
import type { AlgorithmLanguage } from '@/lib/types/database';

const languageMap: Record<AlgorithmLanguage, string> = {
  cpp: 'cpp',
  python: 'python',
  javascript: 'javascript',
  typescript: 'typescript',
  java: 'java',
  go: 'go',
  rust: 'rust',
};

export async function highlightCode(code: string, language: AlgorithmLanguage) {
  return codeToHtml(code, {
    lang: languageMap[language],
    theme: 'github-dark-default',
    structure: 'classic',
  });
}
