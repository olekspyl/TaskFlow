<script setup lang="ts">
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import { useI18n } from 'vue-i18n'

import { HEADER_PARTS } from '@/app/constants/header'
import { useHeaderParts } from '@/app/composables/useHeaderParts'

import { LocaleFeature } from '@/features/locale'
import { ThemeToggle } from '@/features/theme'

import { VTitle } from '@/shared/ui/common'

const route = useRoute()
const { t } = useI18n()

const { hasVisibleParts, isVisible } = useHeaderParts()

const title = computed(() => {
  const titleKey = route.meta.header?.title

  if (!titleKey) {
    return ''
  }

  return t(titleKey)
})
</script>

<template>
  <header
    v-if="hasVisibleParts"
    class="mx-4 mt-4 flex h-20 items-center gap-4 rounded-2xl border border-borderDefault bg-secondaryBg px-6 py-4"
  >
    <div v-if="isVisible(HEADER_PARTS.TITLE)" data-header-slot="title">
      <VTitle :text="title" tag="h3" />
    </div>

    <div class="ml-auto flex items-center gap-3" aria-label="Header actions">
      <div v-if="isVisible(HEADER_PARTS.ACTIONS)" data-header-slot="actions" />

      <div v-if="isVisible(HEADER_PARTS.PERIOD)" data-header-slot="period" />

      <div v-if="isVisible(HEADER_PARTS.LANG_SWITCHER)" data-header-slot="langSwitcher">
        <LocaleFeature />
      </div>

      <div v-if="isVisible(HEADER_PARTS.THEME_SWITCHER)" data-header-slot="themeSwitcher">
        <ThemeToggle />
      </div>
    </div>
  </header>
</template>
