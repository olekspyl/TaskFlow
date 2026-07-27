<script setup lang="ts">
import { computed, watch } from 'vue'
import { useRoute } from 'vue-router'
import { useI18n } from 'vue-i18n'
import { useHeaderParts } from '@/app/composables/useHeaderParts'
import { VButton, VIcon, VLoader } from '@/shared/ui/common'
import { listsApi } from '../lists/api'

const { t } = useI18n()
const route = useRoute()
const { setTitleOverride } = useHeaderParts()

const { getListById } = listsApi()

const listId = computed(() => route.params.id as string)

const {
  data: list,
  loading: listLoading,
  error: listError,
} = getListById(listId, {
  immediate: true,
})

watch(
  list,
  (currentList) => {
    if (currentList) {
      setTitleOverride(currentList.title)
    }
  },
  { immediate: true },
)

// ПЛЕЙСХОЛДЕР: реальних даних задач (пріоритет, дедлайн, статус pending/completed)
// ще немає в API — `list.tasks` містить лише {id, title, status, isWeeklyGoal}.
// Коли з'явиться повний API задач, замінити ці статичні масиви на реальні дані
// (згруповані/відсортовані за status, priority, deadline) і прибрати цей коментар.
const pendingTasksPlaceholder = [
  {
    id: 'placeholder-1',
    title: 'Дописати дизайн-документ',
    priority: 'high',
    dueDate: 'This week',
  },
  { id: 'placeholder-2', title: 'Ревʼю пул-реквестів', priority: 'medium', dueDate: 'Today' },
]

const completedTasksPlaceholder = [
  { id: 'placeholder-3', title: 'Налаштувати CI', priority: 'high', dueDate: '' },
]

const PRIORITY_COLOR: Record<string, string> = {
  high: '#EF4444',
  medium: '#F59E0B',
  low: '#22C55E',
}
</script>

<template>
  <VLoader v-if="listLoading" size="section" />

  <div v-else-if="listError">{{ t('tasks.loadError') }}</div>

  <section v-else-if="list">
    <Teleport defer to='[data-header-slot="actions"]'>
      <!-- ПЛЕЙСХОЛДЕР: немає ще форми/модалки створення задачі — кнопка поки без обробника.
           Коли з'явиться API створення задач, додати @click, що відкриває форму/модалку. -->
      <VButton :text="t('tasks.addTask')" variant="primary" type="button" icon-left="mdi:plus" />
    </Teleport>

    <!-- ПЛЕЙСХОЛДЕР: фільтр за пріоритетом і сортування — не підключені до реальних
         даних/стану, бо задач з реальним API ще немає. -->
    <div
      class="sticky -top-4 z-10 mb-6 flex items-center gap-4 border-b border-borderDefault bg-primaryBg pb-4"
    >
      <span class="text-sm text-muted">{{ t('tasks.priorityLabel') }}</span>
      <select
        class="rounded-lg border border-borderDefault bg-secondaryBg px-3 py-1.5 text-sm text-txtPrimary"
      >
        <option>{{ t('tasks.allPriorities') }}</option>
      </select>

      <span class="text-sm text-muted">{{ t('tasks.sortByLabel') }}</span>
      <select
        class="rounded-lg border border-borderDefault bg-secondaryBg px-3 py-1.5 text-sm text-txtPrimary"
      >
        <option>{{ t('tasks.recentlyCreated') }}</option>
      </select>
    </div>

    <div class="grid grid-cols-1 gap-6 sm:grid-cols-2">
      <div>
        <div class="mb-3 flex items-center gap-2">
          <span class="text-sm font-semibold text-txtPrimary">{{
            t('tasks.pendingColumn')
          }}</span>
          <span class="text-xs text-muted">({{ pendingTasksPlaceholder.length }})</span>
        </div>

        <div class="flex flex-col gap-3">
          <div
            v-for="task in pendingTasksPlaceholder"
            :key="task.id"
            class="flex flex-col gap-2 rounded-xl p-3"
            :style="{
              backgroundColor: `${PRIORITY_COLOR[task.priority]}24`,
              borderColor: `${PRIORITY_COLOR[task.priority]}47`,
              borderWidth: '1px',
            }"
          >
            <div class="flex items-center gap-3">
              <input type="checkbox" class="h-4 w-4 rounded accent-primary" />
              <span class="flex-1 text-sm text-txtPrimary">{{ task.title }}</span>
              <VIcon icon="lucide:more-vertical" class="text-muted" />
            </div>

            <div class="flex items-center justify-between pl-7">
              <span class="text-xs font-medium" :style="{ color: PRIORITY_COLOR[task.priority] }">
                {{ task.priority }}
              </span>
              <span class="text-xs text-muted">{{ task.dueDate }}</span>
            </div>
          </div>
        </div>
      </div>

      <div>
        <div class="mb-3 flex items-center gap-2">
          <span class="text-sm font-semibold text-txtPrimary">{{
            t('tasks.completedColumn')
          }}</span>
          <span class="text-xs text-muted">({{ completedTasksPlaceholder.length }})</span>
        </div>

        <div class="flex flex-col gap-3">
          <div
            v-for="task in completedTasksPlaceholder"
            :key="task.id"
            class="flex flex-col gap-2 rounded-xl border border-borderDefault bg-elevated p-3"
          >
            <div class="flex items-center gap-3">
              <input type="checkbox" checked class="h-4 w-4 rounded accent-primary" />
              <span class="flex-1 text-sm text-muted line-through">{{ task.title }}</span>
              <VIcon icon="lucide:more-vertical" class="text-muted" />
            </div>

            <div class="flex items-center justify-between pl-7">
              <span class="text-xs font-medium text-muted">{{ task.priority }}</span>
              <span class="text-xs text-muted">{{ task.dueDate }}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>
