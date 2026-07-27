<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import { useUserStore } from '@/shared/stores'
import { VTitle } from '@/shared/ui/common'
const { t } = useI18n()
const user = useUserStore()
</script>

<template>
  <Teleport defer to='[data-header-slot="title"]'>
    <VTitle :text="t('header.dashboard', { userName: user.userName })" tag="h3" />
  </Teleport>
  <div>{{ t('navigation.dashboard') }}</div>
</template>

<style scoped></style>
