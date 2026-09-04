import { languageLabels, supportedLanguages } from '@/lib/constants';
import type { AlgorithmLanguage } from '@/lib/types/database';
import { highlightCode } from '@/lib/shiki';
import { CodeTabs, type CodeTab } from './CodeTabs';

type CodeVersion = { language: AlgorithmLanguage; code: string };

export async function AlgorithmCodeSelector({ versions }: { versions: CodeVersion[] }) {
  const available = new Map(versions.map((version) => [version.language, version.code]));
  const ordered = supportedLanguages.filter((language) => available.has(language));

  if (!ordered.length) return null;

  const tabs: CodeTab[] = await Promise.all(
    ordered.map(async (language) => ({
      language,
      label: languageLabels[language],
      code: available.get(language) ?? '',
      html: await highlightCode(available.get(language) ?? '', language),
    })),
  );

  return <CodeTabs tabs={tabs} />;
}
