import { createI18n } from 'vue-i18n'

import uk from './locales/uk.json'
import en from './locales/en.json'

export const i18n = createI18n({
  legacy: false,
  locale: 'uk',
  fallbackLocale: 'en',
  messages: {
    uk,
    en,
  },
})
