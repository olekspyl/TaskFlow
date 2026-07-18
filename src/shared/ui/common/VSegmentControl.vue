<script setup lang="ts">
import { useRouter } from 'vue-router'

type TagItem = {
  id: string
  label: string
}

type Props = {
  tags: TagItem[]
}

defineProps<Props>()

const emit = defineEmits<{
  changeSegment: []
}>()

const activeTag = defineModel<string>()
const router = useRouter()
// робити рооутер реплейс зверху - це не в шеред групі
const selectTag = (tag: TagItem) => {
  activeTag.value = tag.id

  router.replace({
    hash: `#${tag.id}`,
  })

  emit('changeSegment')
}
</script>

<template>
  <div>
    <div class="cursor-pointer">
      <button type="button" v-for="tag in tags" @click="selectTag(tag)" :key="tag.id">
        {{ tag.label }}
      </button>
    </div>
  </div>
</template>

<style scoped></style>
