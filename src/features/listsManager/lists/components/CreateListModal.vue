<script setup lang="ts">
import { computed } from 'vue'

import { VButton } from '@/shared/ui/common'

import { useCreateList } from '../composables/useCreateList'
import { useListsQuery } from '../stores/useListsQuery'

const emit = defineEmits<{
  close: []
}>()

const listsQuery = useListsQuery()

const { createListForm, createListLoading, createList } = useCreateList()

const isSubmitDisabled = computed(() => {
  return createListLoading.value || !createListForm.title.trim()
})

const closeModal = (): void => {
  if (createListLoading.value) {
    return
  }

  emit('close')
}

const handleSubmit = async (): Promise<void> => {
  await createList()

  /*
   * POST інвалідує всі auto-cache entries для GET /lists.
   * Тому fetchMyLists не знайде старий кеш і виконає GET.
   */
  await listsQuery.fetchMyLists()

  emit('close')
}
</script>

<template>
  <Teleport to="body">
    <div
      class="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
      role="presentation"
      @mousedown.self="closeModal"
    >
      <section
        class="w-full max-w-md rounded-xl bg-white p-6 shadow-xl"
        role="dialog"
        aria-modal="true"
        aria-labelledby="create-list-modal-title"
      >
        <header class="mb-6 flex items-center justify-between gap-4">
          <h2 id="create-list-modal-title" class="text-xl font-semibold">Create list</h2>

          <button
            type="button"
            class="text-2xl leading-none"
            aria-label="Close modal"
            :disabled="createListLoading"
            @click="closeModal"
          >
            ×
          </button>
        </header>

        <form class="flex flex-col gap-4" @submit.prevent="handleSubmit">
          <label class="flex flex-col gap-1">
            <span class="text-sm font-medium">Title</span>

            <input
              v-model.trim="createListForm.title"
              type="text"
              required
              autocomplete="off"
              class="rounded-md border px-3 py-2"
            />
          </label>

          <label class="flex flex-col gap-1">
            <span class="text-sm font-medium">Deadline</span>

            <input
              v-model="createListForm.deadline"
              type="datetime-local"
              class="rounded-md border px-3 py-2"
            />
          </label>

          <label class="flex flex-col gap-1">
            <span class="text-sm font-medium">Color</span>

            <input
              v-model="createListForm.hexColor"
              type="color"
              class="h-10 w-full cursor-pointer rounded-md border p-1"
            />
          </label>

          <footer class="mt-4 flex justify-end gap-3">
            <VButton
              text="Cancel"
              type="button"
              variant="primary"
              :disabled="createListLoading"
              @click="closeModal"
            />

            <VButton
              text="Create list"
              type="submit"
              variant="primary"
              :disabled="isSubmitDisabled"
              :loading="createListLoading"
            />
          </footer>
        </form>
      </section>
    </div>
  </Teleport>
</template>

<style scoped></style>
