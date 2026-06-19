import { DateTime } from 'luxon'

type FormatDateOptions = {
  dateFormat?: string
  locale?: string
  timezone?: string
  fallback?: string
}

export const formatDate = (date?: string | Date | null, options: FormatDateOptions = {}) => {
  const { dateFormat = 'dd LLL yyyy', locale = 'en', timezone = 'local', fallback = '—' } = options

  if (!date) return fallback

  const dateTime = typeof date === 'string' ? DateTime.fromISO(date) : DateTime.fromJSDate(date)

  if (!dateTime.isValid) return fallback

  return dateTime.setZone(timezone).setLocale(locale).toFormat(dateFormat)
}
