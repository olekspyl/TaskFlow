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
  <div class="flex gap-6">
    <button
      v-for="tag in tags"
      :key="tag.id"
      type="button"
      class="border-b-2 pb-1 text-sm transition-colors duration-150 ease-out"
      :class="
        activeTag === tag.id
          ? 'border-primary font-semibold text-txtPrimary'
          : 'border-transparent font-medium text-muted hover:text-txtPrimary'
      "
      @click="selectTag(tag)"
    >
      {{ tag.label }}
    </button>
  </div>
</template>

<style scoped></style>
