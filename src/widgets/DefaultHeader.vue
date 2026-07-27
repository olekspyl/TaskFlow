<script setup lang="ts">
import { computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'

import { HEADER_PARTS } from '@/app/constants/header'
import { useHeaderParts } from '@/app/composables/useHeaderParts'

import { LocaleFeature } from '@/features/locale'
import { ThemeToggle } from '@/features/theme'

import { VIcon, VTitle } from '@/shared/ui/common'

const route = useRoute()
const router = useRouter()
const { t } = useI18n()

const { hasVisibleParts, isVisible, titleOverride } = useHeaderParts()

const title = computed(() => {
  if (titleOverride.value) {
    return titleOverride.value
  }

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
    class="mx-4 mt-4 flex h-20 items-center gap-4 rounded-2xl bg-listCardBg px-6 py-4 shadow-soft"
  >
    <button
      v-if="isVisible(HEADER_PARTS.BACK)"
      type="button"
      class="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl text-muted transition-colors hover:text-txtPrimary"
      @click="router.back()"
    >
      <VIcon icon="lucide:arrow-left" />
    </button>

    <div
      v-else
      class="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary text-white"
    >
      <VIcon icon="lucide:layout-grid" />
    </div>

    <div v-if="isVisible(HEADER_PARTS.TITLE)" data-header-slot="title">
      <VTitle :text="title" tag="h3" />
    </div>

    <div class="ml-auto flex items-center gap-3" :aria-label="t('header.actionsAriaLabel')">
      <div v-if="isVisible(HEADER_PARTS.ACTIONS)" data-header-slot="actions" />

      <div v-if="isVisible(HEADER_PARTS.PERIOD)" data-header-slot="period" />

      <div
        v-if="isVisible(HEADER_PARTS.LANG_SWITCHER) || isVisible(HEADER_PARTS.THEME_SWITCHER)"
        class="h-6 w-px bg-borderDefault"
      />

      <div v-if="isVisible(HEADER_PARTS.LANG_SWITCHER)" data-header-slot="langSwitcher">
        <LocaleFeature />
      </div>

      <div v-if="isVisible(HEADER_PARTS.THEME_SWITCHER)" data-header-slot="themeSwitcher">
        <ThemeToggle />
      </div>
    </div>
  </header>
</template>
