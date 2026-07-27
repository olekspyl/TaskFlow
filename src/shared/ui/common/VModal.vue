<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted } from 'vue'
import { useI18n } from 'vue-i18n'

import { useModal } from '../../composables/useModal'
import { VButton, VIcon } from '.'

type Props = {
  id: string
  title: string
  disableClose?: boolean
}

const { id, title, disableClose = false } = defineProps<Props>()

const emit = defineEmits<{
  close: []
}>()

const { t } = useI18n()

const { isOpen, isTop, zIndex, close } = useModal(id)

const titleId = computed(() => `${id}-title`)
const formId = computed(() => `${id}-form`)

const requestClose = (): void => {
  if (disableClose || !isTop.value) {
    return
  }

  close()
  emit('close')
}

const handleKeydown = (event: KeyboardEvent): void => {
  if (event.key === 'Escape') {
    requestClose()
  }
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
    <Transition name="modal" appear>
      <div
        v-if="isOpen"
        class="fixed inset-0 flex items-center justify-center bg-black/50 p-4"
        :style="{ zIndex }"
        role="presentation"
        @mousedown.self="requestClose"
      >
        <section
          class="modal-panel w-full max-w-md rounded-2xl border border-borderDefault bg-secondaryBg p-6 shadow-taught"
          role="dialog"
          aria-modal="true"
          :aria-labelledby="titleId"
        >
          <header class="mb-6 flex items-center justify-between gap-4">
            <slot name="header" :title-id="titleId">
              <h2 :id="titleId" class="text-headingCard text-txtPrimary">
                {{ title }}
              </h2>
            </slot>

            <VButton
              type="button"
              variant="icon"
              class="flex h-8 w-8 items-center justify-center rounded-lg text-muted transition-colors hover:text-txtPrimary"
              :aria-label="t('common.closeModal')"
              :disabled="disableClose"
              @click="requestClose"
            >
              <VIcon icon="lucide:x" />
            </VButton>
          </header>

          <slot name="body" :form-id="formId" />

          <div v-if="$slots.footer" class="mt-6 flex items-center gap-3">
            <slot name="footer" :form-id="formId" />
          </div>
        </section>
      </div>
    </Transition>
  </Teleport>
</template>

<style scoped>
.modal-enter-active,
.modal-leave-active {
  transition: opacity 200ms ease-out;
}

.modal-enter-active .modal-panel,
.modal-leave-active .modal-panel {
  transition:
    opacity 200ms ease-out,
    transform 200ms ease-out;
}

.modal-enter-from,
.modal-leave-to {
  opacity: 0;
}

.modal-enter-from .modal-panel,
.modal-leave-to .modal-panel {
  opacity: 0;
  transform: scale(0.95);
}
</style>
