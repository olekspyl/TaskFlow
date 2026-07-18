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
  <div>
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
