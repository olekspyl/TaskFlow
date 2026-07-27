import { createI18n } from 'vue-i18n'
import { uk, en, pl } from './locales'

export const locales = [
  { code: 'uk', name: 'Українська' },
  { code: 'en', name: 'English' },
  { code: 'pl', name: 'Polska' },
] as const

export const i18n = createI18n({
  legacy: false,
  locale: 'uk',
  fallbackLocale: 'en',
  messages: {
    uk,
    en,
    // pl,
  },
})
