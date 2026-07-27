<script setup lang="ts">
import ListsGrouped from './ListsGrouped.vue'
import type { ListItem } from '../types/lists'

type Props = {
  lists: ListItem[]
}

defineProps<Props>()
</script>

<template>
  <ListsGrouped :lists="lists" collection="usersLists" />
</template>

<style scoped></style>
