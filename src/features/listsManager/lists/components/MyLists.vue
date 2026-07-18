<script setup lang="ts">
import { ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { ListContainer, CreateListModal } from '.'
import { VButton } from '@/shared/ui/common'
import type { ListItem } from '../types/lists'

type Props = {
  lists: ListItem[]
}

defineProps<Props>()

const emit = defineEmits<{
  edit: [list: ListItem]
}>()
const { t } = useI18n()
const isCreateModalOpen = ref(false)

function openCreateModal(): void {
  isCreateModalOpen.value = true
}

function closeCreateModal(): void {
  isCreateModalOpen.value = false
}
</script>

<template>
  <Teleport defer to='[data-header-slot="actions"]'>
    <VButton
      :text="t('common.buttons.createList')"
      variant="primary"
      type="button"
      icon-left="mdi:plus"
      @click="openCreateModal"
    />
  </Teleport>
  <div class="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
    <ListContainer
      v-for="list in lists"
      :key="list.id"
      :list="list"
      collection="myLists"
      @edit="emit('edit', $event)"
    />
  </div>
  <CreateListModal v-if="isCreateModalOpen" @close="closeCreateModal" />
</template>

<style scoped></style>
