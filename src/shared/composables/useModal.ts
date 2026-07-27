import { computed, ref, type ComputedRef } from 'vue'

const modalStack = ref<string[]>([])

type UseModalReturn = {
  id: string
  isOpen: ComputedRef<boolean>
  isTop: ComputedRef<boolean>
  zIndex: ComputedRef<number>
  open: () => void
  close: () => void
  toggle: () => void
}

export const useModal = (id: string): UseModalReturn => {
  if (!id) {
    throw new Error('[useModal]: modal id is required')
  }

  const isOpen = computed(() => {
    return modalStack.value.includes(id)
  })

  const isTop = computed(() => {
    return modalStack.value.at(-1) === id
  })

  const zIndex = computed(() => {
    const index = modalStack.value.indexOf(id)

    return 50 + Math.max(index, 0) * 10
  })

  const open = (): void => {
    modalStack.value = modalStack.value.filter((modalId) => modalId !== id)
    modalStack.value.push(id)
  }

  const close = (): void => {
    modalStack.value = modalStack.value.filter((modalId) => modalId !== id)
  }

  const toggle = (): void => {
    if (isOpen.value) {
      close()
      return
    }
    open()
  }

  return {
    id,
    isOpen,
    isTop,
    zIndex,
    open,
    close,
    toggle,
  }
}
