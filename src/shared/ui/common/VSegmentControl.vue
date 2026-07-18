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
  <div class="inline-flex rounded-full bg-elevated p-1">
    <button
      v-for="tag in tags"
      :key="tag.id"
      type="button"
      class="rounded-full px-4 py-1.5 text-uiLabel transition-colors duration-150 ease-out"
      :class="
        activeTag === tag.id
          ? 'bg-secondaryBg text-txtPrimary shadow-soft'
          : 'text-muted hover:text-txtPrimary'
      "
      @click="selectTag(tag)"
    >
      {{ tag.label }}
    </button>
  </div>
</template>

<style scoped></style>
