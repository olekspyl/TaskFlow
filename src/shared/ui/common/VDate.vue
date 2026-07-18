<script setup lang="ts">
import { computed } from 'vue'
import { formatDate } from '@/shared/utils'

type Props = {
  date?: string | Date | null
  dateFormat?: string
  locale?: string
  timezone?: string
  fallback?: string
}

const {
  date,
  dateFormat = 'dd LLL yyyy',
  locale = 'en',
  timezone = 'local',
  fallback = '—',
} = defineProps<Props>()

const formattedDate = computed(() =>
  formatDate(date, {
    dateFormat: dateFormat,
    locale: locale,
    timezone: timezone,
    fallback: fallback,
  }),
)
</script>

<template>
  <span title="date">{{ formattedDate }}</span>
</template>
