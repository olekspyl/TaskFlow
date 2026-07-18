import { computed, ref } from 'vue'
import { DEFAULT_HEADER_PARTS } from '@/app/constants/header'
import type { HeaderPart } from '@/app/constants/header'

type HeaderPartsConfig = {
  showExtra?: readonly HeaderPart[]
  hide?: readonly HeaderPart[]
}

const visibleParts = ref<Set<HeaderPart>>(new Set())

export const useHeaderParts = () => {
  const hasVisibleParts = computed(() => visibleParts.value.size > 0)

  const setVisible = (config?: HeaderPartsConfig) => {
    const next = new Set<HeaderPart>(DEFAULT_HEADER_PARTS)

    config?.showExtra?.forEach((part) => next.add(part))
    config?.hide?.forEach((part) => next.delete(part))

    visibleParts.value = next
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
    setVisible,
    show,
    hide,
    reset,
    isVisible,
  }
}
