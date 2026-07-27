<script setup lang="ts">
import { ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { ListsGrouped, CreateListModal } from '.'
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
  <ListsGrouped :lists="lists" collection="myLists" />
  <CreateListModal v-if="isCreateModalOpen" @close="closeCreateModal" />
</template>

<style scoped></style>
