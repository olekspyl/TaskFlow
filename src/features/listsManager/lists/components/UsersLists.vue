<script setup lang="ts">
import ListContainer from './ListContainer.vue'
import type { ListItem } from '../types/lists'

type Props = {
  lists: ListItem[]
}

defineProps<Props>()

const emit = defineEmits<{
  edit: [list: ListItem]
}>()
</script>

<template>
  <div class="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
    <ListContainer
      v-for="list in lists"
      :key="list.id"
      :list="list"
      collection="usersLists"
      @edit="emit('edit', $event)"
    />
  </div>
</template>

<style scoped></style>
