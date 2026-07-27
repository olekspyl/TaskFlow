<script setup lang="ts">
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'

const { locale, availableLocales } = useI18n({
  useScope: 'global',
})

const useSelect = computed(() => availableLocales.length > 2)

function setLocale(lang: string) {
  locale.value = lang
  localStorage.setItem('locale', lang)
}
</script>

<template>
  <select
    v-if="useSelect"
    v-model="locale"
    class="rounded-lg border border-borderDefault bg-secondaryBg px-3 py-1.5 text-sm text-txtPrimary transition-colors hover:border-borderHover focus:border-primary focus:outline-none"
  >
    <option v-for="lang in availableLocales" :key="lang" :value="lang">
      {{ lang.toUpperCase() }}
    </option>
  </select>

  <div v-else class="inline-flex items-center gap-1 rounded-full bg-elevated p-1">
    <button
      v-for="lang in availableLocales"
      :key="lang"
      type="button"
      class="rounded-full px-2.5 py-1 text-xs font-semibold transition-colors duration-150 ease-out"
      :class="locale === lang ? 'bg-secondaryBg text-txtPrimary shadow-soft' : 'text-muted hover:text-txtPrimary'"
      @click="setLocale(lang)"
    >
      {{ lang.toUpperCase() }}
    </button>
  </div>
</template>
