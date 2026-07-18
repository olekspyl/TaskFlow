<script setup lang="ts">
import { useI18n } from 'vue-i18n'

import { VInput, VSelect, VButton } from '@/shared/ui/common'

import { SORTING_OPTIONS } from '../constants/sortingOptions'
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
</script>

<template>
  <div class="flex items-center gap-6">
    <div class="h-12 w-[320px]">
      <VInput
        v-model="filtering"
        type="search"
        placeholder="Search"
        icon-left="material-symbols:search"
        :debounce="1000"
        @update:model-value="emit('change')"
      />
    </div>

    <VSelect
      v-model="sorting"
      :options="SORTING_OPTIONS"
      label="Sort by"
      @update:model-value="emit('change')"
    />

    <VButton
      :text="t('common.buttons.resetFilters')"
      variant="primary"
      type="button"
      @click="action"
    />
  </div>
</template>
