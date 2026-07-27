<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted } from 'vue'
import { useI18n } from 'vue-i18n'

import { useModal } from '../../composables/useModal'
import { VButton, VIcon } from '.'

type Props = {
  id: string
  title: string
  side?: 'left' | 'right'
  disableClose?: boolean
}

const { id, title, side = 'right', disableClose = false } = defineProps<Props>()

const emit = defineEmits<{
  close: []
}>()

const { t } = useI18n()

const { isOpen, isTop, zIndex, close } = useModal(id)

const titleId = computed(() => `${id}-title`)
const formId = computed(() => `${id}-form`)

const panelClasses = computed(() => {
  return [
    side === 'left' ? 'left-0' : 'right-0',
    side === 'left' ? 'drawer-panel-left' : 'drawer-panel-right',
  ]
})

const requestClose = (): void => {
  if (disableClose || !isTop.value) {
    return
  }

  close()
  emit('close')
}

const handleKeydown = (event: KeyboardEvent): void => {
  if (event.key !== 'Escape') {
    return
  }

  requestClose()
}

onMounted(() => {
  window.addEventListener('keydown', handleKeydown)
})

onBeforeUnmount(() => {
  window.removeEventListener('keydown', handleKeydown)
  close()
})
</script>

<template>
  <Teleport to="body">
    <Transition name="drawer" appear>
      <div
        v-if="isOpen"
        class="fixed inset-0 bg-black/50"
        :style="{ zIndex }"
        role="presentation"
        @mousedown.self="requestClose"
      >
        <aside
          class="drawer-panel fixed top-0 flex h-full w-full max-w-md flex-col border-borderDefault bg-secondaryBg shadow-taught"
          :class="panelClasses"
          role="dialog"
          aria-modal="true"
          :aria-labelledby="titleId"
        >
          <header class="flex items-center justify-between gap-4 border-b border-borderDefault p-6">
            <slot name="header" :title-id="titleId">
              <h2 :id="titleId" class="text-headingCard text-txtPrimary">
                {{ title }}
              </h2>
            </slot>

            <VButton
              type="button"
              variant="icon"
              class="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-muted transition-colors hover:text-txtPrimary"
              :aria-label="t('common.closeDrawer')"
              :disabled="disableClose"
              @click="requestClose"
            >
              <VIcon icon="lucide:x" />
            </VButton>
          </header>

          <div class="min-h-0 flex-1 overflow-y-auto p-6">
            <slot name="body" :form-id="formId" />
          </div>

          <footer v-if="$slots.footer" class="border-t border-borderDefault p-6">
            <slot name="footer" :form-id="formId" />
          </footer>
        </aside>
      </div>
    </Transition>
  </Teleport>
</template>

<style scoped>
.drawer-enter-active,
.drawer-leave-active {
  transition: background-color 200ms ease-out;
}

.drawer-enter-active .drawer-panel,
.drawer-leave-active .drawer-panel {
  transition: transform 200ms ease-out;
}

.drawer-enter-from,
.drawer-leave-to {
  background-color: transparent;
}

.drawer-enter-from .drawer-panel-left,
.drawer-leave-to .drawer-panel-left {
  transform: translateX(-100%);
}

.drawer-enter-from .drawer-panel-right,
.drawer-leave-to .drawer-panel-right {
  transform: translateX(100%);
}
</style>
