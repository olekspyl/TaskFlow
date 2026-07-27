<script setup lang="ts">
import { useI18n } from 'vue-i18n'

import { VInput, VSelect, VButton } from '@/shared/ui/common'

import { useSortingOptions } from '../constants/sortingOptions'
import type { SortingOption } from '../types/lists'

type Props = {
  action: () => void | Promise<void>
}

defineProps<Props>()

const emit = defineEmits<{
  change: []
}>()

const sorting = defineModel<SortingOption>('sorting', {
  required: true,
})

const filtering = defineModel<string>('filtering', {
  required: true,
})

const { t } = useI18n()
const { sortingOptions } = useSortingOptions()
</script>

<template>
  <div class="flex flex-col gap-3 sm:flex-row sm:items-center">
    <div class="h-12 w-full sm:w-72">
      <VInput
        v-model="filtering"
        type="search"
        :placeholder="t('lists.filters.searchPlaceholder')"
        icon-left="material-symbols:search"
        :debounce="1000"
        @update:model-value="emit('change')"
      />
    </div>

    <VSelect
      v-model="sorting"
      :options="sortingOptions"
      track-by="id"
      :label="t('lists.filters.sortByLabel')"
      @update:model-value="emit('change')"
    />

    <VButton
      :text="t('common.buttons.resetFilters')"
      variant="icon"
      type="button"
      @click="action"
    />
  </div>
</template>
