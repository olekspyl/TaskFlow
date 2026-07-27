<script setup lang="ts">
import ListContainer from './ListContainer.vue'
import type { ListItem } from '../types/lists'

type Props = {
  lists: ListItem[]
}

defineProps<Props>()
</script>

<template>
  <div class="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
    <ListContainer v-for="list in lists" :key="list.id" :list="list" collection="usersLists" />
  </div>
</template>

<style scoped></style>
