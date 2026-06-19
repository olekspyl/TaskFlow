export const getInitials = (name: string): string => {
  const words = name.trim().split(/\s+/).filter(Boolean)

  if (!words.length) return ''

  const firstInitial = words[0]?.[0] ?? ''
  const lastInitial = words.length > 1 ? (words[words.length - 1]?.[0] ?? '') : ''

  return `${firstInitial}${lastInitial}`.toUpperCase()
}
