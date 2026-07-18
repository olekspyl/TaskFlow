<script setup lang="ts">
import { computed} from 'vue'
import { VIcon, VButton, VSkeleton } from '@/shared/ui/common'
import type { TableColumn, SortingOptions } from './types/table'

type Props = {
  columns: TableColumn[]
  totalPages: number
  items: any
  loading: boolean
  scrollable?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  scrollable: true,
})


const sort = defineModel<SortingOptions>('sort', {
  default: () => ({
    sortBy: 'createdAt',
    sortOrder: 'asc',
  }),
})


const pagination = defineModel<{
  limit: number,
  hasMore: boolean,
  currentPage: number,
}>('pagination', {
  default: () => ({
    limit: 20,
    hasMore: false,
    currentPage: 1,
  }),
})

const gridStyle = computed(() => ({
  gridTemplateColumns: props.columns.map((column) => `minmax(${column.width}, auto)`).join(' '),
}))

const paginationReset = () => {
 pagination.value.limit = 20
 pagination.value.currentPage = 1
 pagination.value.hasMore = false
}

const handleSort = (key: string) => {
  if (sort.value.sortBy !== key) {
    sort.value = {
      sortBy: key,
      sortOrder: 'asc',
    }
    paginationReset()
  } else {
    sort.value = {
      ...sort.value,
      sortOrder: sort.value.sortOrder === 'asc' ? 'desc' : 'asc',
    }
  }
}

const loadMore = () => {
  const nextPage = pagination.value.currentPage

  if (nextPage >= props.totalPages) return

  pagination.value = {
    ...pagination.value,
    limit: pagination.value.limit + 20,
    hasMore: nextPage < props.totalPages,
  }
}

</script>

<template>
  <div :class="['p-6 box-border flex flex-col gap-6', scrollable && 'flex-1 min-h-0']">
    <slot name="toolbar" />

    <div
      :class="[
        'flex flex-col bg-secondaryBg',
        scrollable ? 'overflow-hidden flex-1 min-h-0' : 'overflow-x-auto',
      ]"
    >
      <div
        class="grid min-w-max auto-rows-max"
        :class="scrollable && 'flex-1 min-h-0 overflow-auto'"
        :style="gridStyle"
      >
        <template v-for="column in props.columns" :key="`head-${column.key}`">
          <div
            :class="[
              'sticky top-0 z-20 flex items-center justify-center text-center bg-elevated px-5 py-4 text-uiCaption font-semibold uppercase tracking-wide text-muted',
              column.separator && 'border-l-2 border-primary',
            ]"
          >
            <slot name="headerTitle" :column="column">
              {{ column.label }}
            </slot>
            <template v-if="column.sortable">
              <button
                class="flex items-center gap-0 rounded focus-visible:shadow-focusRing"
                @click="handleSort(column.key)"
              >
                <span
                  class="transition-all duration-200"
                  :class="
                    sort.sortBy === column.key && sort.sortOrder === 'asc'
                      ? 'text-primary drop-shadow-[0_0_4px_var(--color-primary)]'
                      : 'text-muted hover:text-txtPrimary'
                  "
                >
                  <VIcon icon="mdi:arrow-up-thin" size="18" />
                </span>
                <span
                  class="-ml-1.5 transition-all duration-200"
                  :class="
                    sort.sortBy === column.key && sort.sortOrder === 'desc'
                      ? 'text-primary drop-shadow-[0_0_4px_var(--color-primary)]'
                      : 'text-muted hover:text-txtPrimary'
                  "
                >
                  <VIcon icon="mdi:arrow-down-thin" size="18" />
                </span>
              </button>
            </template>
          </div>
        </template>

        <template v-if="props.loading">
          <slot name="loading">
            <template v-for="rowIndex in 6" :key="`skeleton-row-${rowIndex}`">
              <div
                v-for="(column, columnIndex) in props.columns"
                :key="`skeleton-${rowIndex}-${column.key}`"
                class="flex h-[70px] items-center border-b border-tableBorder bg-secondaryBg px-4"
              >
                <VSkeleton v-if="column.label" :width="columnIndex % 2 === 0 ? '70%' : '50%'" height="14px" />
              </div>
            </template>
          </slot>
        </template>

        <template v-else>
          <div
            v-if="!props.items?.length"
            class="flex h-full min-h-[300px] items-center justify-center bg-secondaryBg text-muted"
            :style="{ gridColumn: '1 / -1' }"
          >
            <p>There is no data in the table</p>
          </div>
          <template v-else>
            <template v-for="(item, rowIndex) in props.items" :key="item.id ?? rowIndex">
              <template v-for="column in props.columns" :key="`${rowIndex}-${column.key}`">
                <div
                  :class="[
                    'flex h-[70px] items-center border-b border-tableBorder bg-secondaryBg px-4 break-words',
                    column.separator && 'border-l-2 border-primary',
                  ]"
                >
                  <slot
                    :name="column.key"
                    :item="item"
                    :value="(item as Record<string, unknown>)[column.key]"
                    :row-index="rowIndex"
                    :column="column"
                  >
                    {{ (item as Record<string, unknown>)[column.key] }}
                  </slot>
                </div>
              </template>
            </template>
          </template>
        </template>
      </div>
    </div>
    <slot name="loadMore">
      <div v-if='pagination.hasMore'
 class='flex justify-center w-full'>
        <VButton
        class="w-[150px] h-[40px] p-6"
        text="Load more"
        :disabled='props.loading'
        :loading="props.loading"
        @click="loadMore"
      />
      </div>

    </slot>
  </div>
</template>
