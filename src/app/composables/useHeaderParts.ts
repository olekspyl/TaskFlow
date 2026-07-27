import { computed, ref } from 'vue'
import { DEFAULT_HEADER_PARTS } from '@/app/constants/header'
import type { HeaderPart } from '@/app/constants/header'

type HeaderPartsConfig = {
  showExtra?: readonly HeaderPart[]
  hide?: readonly HeaderPart[]
}

const visibleParts = ref<Set<HeaderPart>>(new Set())

// Дозволяє сторінці показати динамічний заголовок (напр. назву конкретного
// списку) замість статичного meta.header.title. Скидається при кожній
// навігації (setVisible викликається router-guard'ом на кожен перехід).
const titleOverride = ref<string | null>(null)

export const useHeaderParts = () => {
  const hasVisibleParts = computed(() => visibleParts.value.size > 0)

  const setVisible = (config?: HeaderPartsConfig) => {
    const next = new Set<HeaderPart>(DEFAULT_HEADER_PARTS)

    config?.showExtra?.forEach((part) => next.add(part))
    config?.hide?.forEach((part) => next.delete(part))

    visibleParts.value = next
    titleOverride.value = null
  }

  const setTitleOverride = (text: string) => {
    titleOverride.value = text
  }

  const clearTitleOverride = () => {
    titleOverride.value = null
  }

  const show = (parts: readonly HeaderPart[]) => {
    const next = new Set(visibleParts.value)

    parts.forEach((part) => next.add(part))

    visibleParts.value = next
  }

  const hide = (parts: readonly HeaderPart[]) => {
    const next = new Set(visibleParts.value)

    parts.forEach((part) => next.delete(part))

    visibleParts.value = next
  }

  const reset = () => {
    visibleParts.value = new Set()
  }

  const isVisible = (part: HeaderPart) => visibleParts.value.has(part)

  return {
    visibleParts,
    hasVisibleParts,
    titleOverride,
    setVisible,
    setTitleOverride,
    clearTitleOverride,
    show,
    hide,
    reset,
    isVisible,
  }
}
