import { useRoute } from 'vue-router'

export const getNormalizedRouteId = (): string | null => {
  const route = useRoute()
  const params = route.params as Record<string, string | string[] | undefined>

  if (params.id !== undefined) {
    const raw = params.id
    if (Array.isArray(raw)) return raw[0] ?? null
    return raw ?? null
  }

  const definedValues = Object.values(params).filter((v): v is string | string[] => v !== undefined)
  if (definedValues.length === 0) return null
  const first = definedValues[0]
  return (Array.isArray(first) ? first[0] : first) ?? null
}
