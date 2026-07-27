import { DefaultHeader } from '@/widgets'

export const HEADER_PARTS = {
  BACK: 'back',
  TITLE: 'title',
  ACTIONS: 'actions',
  PERIOD: 'period',
  LANG_SWITCHER: 'langSwitcher',
  THEME_SWITCHER: 'themeSwitcher',
} as const

export type HeaderPart = (typeof HEADER_PARTS)[keyof typeof HEADER_PARTS]

export const DEFAULT_HEADER_PARTS = [
  HEADER_PARTS.TITLE,
  HEADER_PARTS.LANG_SWITCHER,
  HEADER_PARTS.THEME_SWITCHER,
] as const satisfies readonly HeaderPart[]

export const HEADER_COMPONENTS = {
  DEFAULT: DefaultHeader,
} as const

export type HeaderComponentName = (typeof HEADER_COMPONENTS)[keyof typeof HEADER_COMPONENTS]

export const HEADER_TITLES = {
  DASHBOARD: 'dashboard',
  LISTS: 'lists',
  ANALYTICS: 'analytics',
} as const

export type HeaderTitleName = (typeof HEADER_TITLES)[keyof typeof HEADER_TITLES]
