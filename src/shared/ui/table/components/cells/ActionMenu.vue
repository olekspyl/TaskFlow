<script setup lang="ts">
import { ref, useTemplateRef } from 'vue'
import { onClickOutside } from '@vueuse/core'
import { VIcon } from '@/shared/ui/common'

type Action = {
  name: string
  label: string
  execute: () => void
  style?: string
  icon?: string
}

type Props = {
  actions: Action[]
}

defineProps<Props>()

const emit = defineEmits<{
  action: string
}>()

const triggerRef = useTemplateRef<HTMLElement>('triggerRef')
const menuRef = useTemplateRef<HTMLElement>('menuRef')
const showActions = ref(false)
const menuStyle = ref({ top: '0px', right: '0px' })

onClickOutside(
  menuRef,
  () => {
    showActions.value = false
  },
  { ignore: [triggerRef] },
)

const toggleActions = () => {
  if (!showActions.value && triggerRef.value) {
    const rect = triggerRef.value.getBoundingClientRect()
    menuStyle.value = {
      top: `${rect.bottom + 4}px`,
      right: `${window.innerWidth - rect.right}px`,
    }
  }
  showActions.value = !showActions.value
}

const onClickHandler = (action: Action) => {
  action.execute()
  showActions.value = false
}
</script>

<template>
  <div class="flex flex-col items-end justify-center w-full h-full">
    <button
      ref="triggerRef"
      @click="toggleActions"
      type="button"
      class="flex h-8 w-8 items-center justify-center rounded-lg border border-transparent text-muted transition-colors hover:border-primary hover:text-primary hover:shadow-focusRing focus-visible:border-primary focus-visible:shadow-focusRing"
    >
      <VIcon icon="lucide:more-vertical" />
    </button>

    <Teleport to="body">
      <ul
        v-if="showActions"
        ref="menuRef"
        class="fixed z-50 flex flex-col cursor-pointer px-3 py-2 rounded-md min-w-[136px] bg-secondaryBg shadow-md border border-borderDefault"
        :style="menuStyle"
      >
        <slot name="actionList">
          <li
            v-for="action in actions"
            :key="action.name"
            @click="onClickHandler(action)"
            class="group flex items-center gap-2 overflow-hidden rounded-md px-2 py-[6px] transition-all duration-150"
            :class="
              action.style === 'dangerous'
                ? 'text-dangerous hover:bg-[rgba(239,68,68,0.12)] hover:text-hoverDangerous hover:shadow-[0_0_12px_-2px_rgba(239,68,68,0.55)]'
                : 'text-txtPrimary hover:bg-elevated hover:text-primary'
            "
          >
            <VIcon v-if="action.icon" :icon="action.icon" :size="16" class="shrink-0" />
            <p class="transition-colors duration-150">
              {{ action.label }}
            </p>
          </li>
        </slot>
      </ul>
    </Teleport>
  </div>
</template>

<style scoped></style>
