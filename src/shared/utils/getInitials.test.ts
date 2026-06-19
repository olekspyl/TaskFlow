import { describe, it, expect } from 'vitest'
import { getInitials } from './getInitials'

describe('getInitials', () => {
  it('returns first and last initials for a full name', () => {
    expect(getInitials('Olena Marchenko')).toBe('OM')
  })

  it('returns a single initial for a one-word name', () => {
    expect(getInitials('Olena')).toBe('O')
  })

  it('uses the first and last words for names with more than two parts', () => {
    expect(getInitials('Anna Maria Kovalenko')).toBe('AK')
  })

  it('collapses extra whitespace between words', () => {
    expect(getInitials('  Olena   Marchenko  ')).toBe('OM')
  })

  it('returns an empty string for empty input', () => {
    expect(getInitials('')).toBe('')
  })
})
