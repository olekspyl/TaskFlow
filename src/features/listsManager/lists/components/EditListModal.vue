<script setup lang="ts">
import { computed } from 'vue'

import { VButton } from '@/shared/ui/common'
import { useUpdateList } from '../composables/useUpdateList'
import { useListsQuery } from '../stores/useListsQuery'
import type { ListItem, ListSegment } from '../types/lists'

type Props = {
  list: ListItem
  collection: ListSegment
}

const props = defineProps<Props>()

const emit = defineEmits<{
  close: []
}>()

const listsQuery = useListsQuery()

const { updateListForm, updateListLoading, updateList, fillUpdateListForm } = useUpdateList(
  () => props.list.id,
)

fillUpdateListForm({
  title: props.list.title,
  deadline: props.list.deadline ?? '',
  hexColor: props.list.hexColor,
})

const isSubmitDisabled = computed(() => {
  return updateListLoading.value || !updateListForm.title.trim()
})

function closeModal(): void {
  if (updateListLoading.value) {
    return
  }

  emit('close')
}

async function refetchCurrentCollection(): Promise<void> {
  const fetchLists =
    props.collection === 'myLists' ? listsQuery.fetchMyLists : listsQuery.fetchUsersLists

  await fetchLists()
}

async function handleSubmit(): Promise<void> {
  await updateList()
  await refetchCurrentCollection()

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
        aria-labelledby="edit-list-modal-title"
      >
        <header class="mb-6 flex items-center justify-between gap-4">
          <h2 id="edit-list-modal-title" class="text-xl font-semibold">Edit list</h2>

          <button
            type="button"
            class="text-2xl leading-none"
            aria-label="Close modal"
            :disabled="updateListLoading"
            @click="closeModal"
          >
            ×
          </button>
        </header>

        <form class="flex flex-col gap-4" @submit.prevent="handleSubmit">
          <label class="flex flex-col gap-1">
            <span class="text-sm font-medium"> Title </span>

            <input
              v-model.trim="updateListForm.title"
              type="text"
              required
              autocomplete="off"
              class="rounded-md border px-3 py-2"
            />
          </label>

          <label class="flex flex-col gap-1">
            <span class="text-sm font-medium"> Deadline </span>

            <input
              v-model="updateListForm.deadline"
              type="datetime-local"
              class="rounded-md border px-3 py-2"
            />
          </label>

          <label class="flex flex-col gap-1">
            <span class="text-sm font-medium"> Color </span>

            <input
              v-model="updateListForm.hexColor"
              type="color"
              class="h-10 w-full cursor-pointer rounded-md border p-1"
            />
          </label>

          <footer class="mt-4 flex justify-end gap-3">
            <VButton
              text="Cancel"
              type="button"
              variant="secondary"
              :disabled="updateListLoading"
              @click="closeModal"
            />

            <VButton
              text="Save changes"
              type="submit"
              variant="primary"
              :disabled="isSubmitDisabled"
              :loading="updateListLoading"
            />
          </footer>
        </form>
      </section>
    </div>
  </Teleport>
</template>

<style scoped></style>
