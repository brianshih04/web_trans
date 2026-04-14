export interface LanguageOption {
  code: string
  label: string
  group: string
}

export const LANGUAGES: LanguageOption[] = [
  { code: 'zh-TW', label: '繁體中文', group: '東亞' },
  { code: 'zh-CN', label: '简体中文', group: '東亞' },
  { code: 'ja-JP', label: '日本語', group: '東亞' },
  { code: 'ko-KR', label: '한국어', group: '東亞' },
  { code: 'en-US', label: 'English', group: '西歐' },
  { code: 'fr-FR', label: 'Français', group: '西歐' },
  { code: 'de-DE', label: 'Deutsch', group: '西歐' },
  { code: 'es-ES', label: 'Español', group: '西歐' },
  { code: 'pt-PT', label: 'Português', group: '西歐' },
  { code: 'it-IT', label: 'Italiano', group: '西歐' },
  { code: 'nl-NL', label: 'Nederlands', group: '西歐' },
  { code: 'ru-RU', label: 'Русский', group: '東歐' },
  { code: 'uk-UA', label: 'Українська', group: '東歐' },
  { code: 'pl-PL', label: 'Polski', group: '東歐' },
  { code: 'cs-CZ', label: 'Čeština', group: '東歐' },
  { code: 'hu-HU', label: 'Magyar', group: '東歐' },
  { code: 'ro-RO', label: 'Română', group: '東歐' },
  { code: 'fa-IR', label: 'فارسی', group: '中東/亞洲' },
  { code: 'th-TH', label: 'ไทย', group: '中東/亞洲' },
]

export const LANGUAGE_GROUPS = [...new Set(LANGUAGES.map(l => l.group))]

export const DEFAULT_LANG = 'zh-TW'
