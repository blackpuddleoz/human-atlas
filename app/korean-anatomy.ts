import type { Atlas, Concept, SystemId } from './anatomy';
import glossary from './anatomy-ko.json';

type KoreanEntry = { ko: string; aliases: string[]; summary?: string };
const TERMS = glossary as Record<string, KoreanEntry>;
const normalize = (value: string) => value.normalize('NFKC').toLocaleLowerCase().replace(/[\\s()\\-_/·.,]/g, '');

export const KOREAN_SYSTEMS: Partial<Record<SystemId, string>> = {
  skeletal: '골격계',
  muscular: '근육계',
};

export function koreanSystemName(system: SystemId, fallback: string): string {
  return KOREAN_SYSTEMS[system] ?? fallback;
}

function translatedEntry(name: string): KoreanEntry | null {
  const key = name.trim().toLocaleLowerCase();
  const direct = TERMS[key];
  if (direct) return direct;
  const prefix = key.match(/^(right|left) (.+)$/);
  const infix = key.match(/^(.+?) of (right|left) (.+)$/);
  const side = prefix?.[1] ?? infix?.[2];
  const base = prefix?.[2] ?? (infix ? `${infix[1]} of ${infix[3]}` : '');
  if (!side || !base) return null;
  const entry = TERMS[base];
  if (!entry) return null;
  const fullSide = side === 'right' ? '오른쪽' : '왼쪽';
  const clinicalSide = side === 'right' ? '우측' : '좌측';
  return {
    ko: `${fullSide} ${entry.ko}`,
    aliases: [
      `${clinicalSide} ${entry.ko}`,
      ...entry.aliases.flatMap(alias => [`${fullSide} ${alias}`, `${clinicalSide} ${alias}`]),
    ],
    summary: entry.summary,
  };
}

export function getKoreanName(englishName: string): string {
  return translatedEntry(englishName)?.ko ?? englishName;
}

export function getKoreanSummary(englishName: string): string | null {
  return translatedEntry(englishName)?.summary ?? null;
}

export function conceptMatchesKoreanQuery(concept: Concept, query: string): boolean {
  const needle = normalize(query);
  if (!needle) return true;
  if (normalize(concept.name).includes(needle) || normalize(concept.id).includes(needle)) return true;
  const entry = translatedEntry(concept.name);
  if (!entry) return false;
  return [entry.ko, ...entry.aliases].some(candidate => normalize(candidate).includes(needle));
}

/** Search all concepts; retain English and FMA-ID search even for untranslated concepts. */
export function findAnatomyConcepts(atlas: Atlas, query: string, limit = 80): Concept[] {
  const normalizedQuery = normalize(query);
  if (!normalizedQuery) {
    const suggested = [
      'scapula', 'humerus', 'thoracic vertebra', 'zone of deltoid',
      'serratus anterior', 'psoas major', 'gluteus maximus', 'femur',
    ];
    return suggested.map(name => atlas.concepts.find(c => c.name.toLowerCase() === name))
      .filter((concept): concept is Concept => Boolean(concept));
  }
  const matching = atlas.concepts.filter(c => conceptMatchesKoreanQuery(c, query));
  const rank = (c: Concept): number => {
    const english = normalize(c.name);
    const translation = translatedEntry(c.name);
    const localized = translation ? [translation.ko, ...translation.aliases].map(normalize) : [];
    if (english === normalizedQuery || localized.includes(normalizedQuery)) return 0;
    if (english.startsWith(normalizedQuery) || localized.some(s => s.startsWith(normalizedQuery))) return 1;
    return 2;
  };
  return matching.sort((a, b) => rank(a) - rank(b) || a.name.length - b.name.length)
    .slice(0, limit);
}
