import { describe, it, expect } from 'vitest'
import { getPermissionsSummary } from './permissionsSummary'

describe('getPermissionsSummary', () => {
  it('counts granted permissions out of total', () => {
    expect(getPermissionsSummary({ a: true, b: false, c: true })).toEqual({
      granted: 2,
      total: 3,
    })
  })

  it('returns zeroes for an empty map', () => {
    expect(getPermissionsSummary({})).toEqual({ granted: 0, total: 0 })
  })

  it('returns total equal to granted when everything is true', () => {
    expect(getPermissionsSummary({ a: true, b: true })).toEqual({ granted: 2, total: 2 })
  })

  it('returns granted 0 when everything is false', () => {
    expect(getPermissionsSummary({ a: false, b: false })).toEqual({ granted: 0, total: 2 })
  })
})
