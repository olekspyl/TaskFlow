export const cleanEmptyKeys = <T extends Record<string, unknown>>(obj: T) => {
  return Object.fromEntries(
    Object.entries(obj).filter(([, value]) => {
      if (value === '' || value === null || value === undefined) return false
      if (Array.isArray(value) && value.length === 0) return false

      return true
    }),
  )
}
