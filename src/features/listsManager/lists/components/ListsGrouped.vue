<script setup lang="ts">
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { VIcon } from '@/shared/ui/common'
import ListContainer from './ListContainer.vue'
import { getListUrgency } from '../utils'
import type { ListItem, ListSegment } from '../types/lists'

type Props = {
  lists: ListItem[]
  collection: ListSegment
}

const props = defineProps<Props>()

const { t } = useI18n()

const groups = computed(() =>
  [
    {
      key: 'overdue',
      label: t('lists.groups.overdue'),
      icon: 'lucide:alert-triangle',
      textClass: 'text-dangerous',
      items: props.lists.filter((list) => getListUrgency(list) === 'overdue'),
    },
    {
      key: 'soon',
      label: t('lists.groups.soon'),
      icon: 'lucide:clock',
      textClass: 'text-warning',
      items: props.lists.filter((list) => getListUrgency(list) === 'soon'),
    },
    {
      key: 'rest',
      label: t('lists.groups.rest'),
      icon: '',
      textClass: 'text-muted',
      items: props.lists.filter((list) => getListUrgency(list) === 'rest'),
    },
  ].filter((group) => group.items.length),
)
</script>

<template>
  <div class="flex flex-col gap-6">
    <section v-for="group in groups" :key="group.key" class="flex flex-col gap-2">
      <p class="flex items-center gap-1.5 text-uiLabel" :class="group.textClass">
        <VIcon v-if="group.icon" :icon="group.icon" :size="14" />
        {{ group.label }}
      </p>

      <ListContainer
        v-for="list in group.items"
        :key="list.id"
        :list="list"
        :collection="collection"
      />
    </section>
  </div>
</template>

<style scoped></style>
