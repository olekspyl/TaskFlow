<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import { VButton } from '@/shared/ui/common'

const { t } = useI18n()
</script>

<template>
  <div>
    <p>{{ t('notFound.message') }}</p>
    <VButton to="/" :text="t('notFound.button')" />
  </div>
</template>

<style scoped></style>
