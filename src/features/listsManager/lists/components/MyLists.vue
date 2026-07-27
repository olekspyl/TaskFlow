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

const { t } = useI18n()
const isCreateModalOpen = ref(false)


const openCreateModal = () => {
  isCreateModalOpen.value = true
}

const closeCreateModal = () => {
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
  <div class="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
    <ListContainer
      v-for="list in lists"
      :key="list.id"
      :list="list"
      collection="myLists"
    />
  </div>
  <CreateListModal v-if="isCreateModalOpen" @close="closeCreateModal" />
</template>

<style scoped></style>
