<script setup lang="ts">
import { computed, ref, useAttrs, type ClassValue } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useI18n } from 'vue-i18n'

const router = useRouter()
const route = useRoute()
const attrs = useAttrs()
const { t } = useI18n()

type Tab = {
  id: string
  label: string
  component?: any
  icon?: string
}

type Props = {
  tabs: Tab[]
  tabSelectionMode?: 'auto' | 'controlled'
  useHash?: boolean
  defaultTab: string
  ariaLabel?: string
  tabListClass?: ClassValue
  tabItemClass?: ClassValue
  activeTabItemClass?: ClassValue
}

const {
  tabs,
  tabSelectionMode = 'auto',
  useHash = true,
  defaultTab,
  ariaLabel,
  tabListClass,
  tabItemClass,
  activeTabItemClass,
} = defineProps<Props>()

const activeTabId = ref(route.hash ? route.hash.slice(1) : defaultTab)
const activeTabComponent = computed(() => tabs.find((t) => t.id === activeTabId.value) ?? tabs[0])

const rootClass = computed(() => attrs.class as ClassValue | undefined)
const resolvedAriaLabel = computed(() => ariaLabel ?? t('common.tabsAriaLabel'))

const isActive = (tabId: string) => activeTabId.value === tabId

const syncHash = async (tabId: string) => {
  if (useHash && router.currentRoute.value.hash !== `#${tabId}`) {
    await router.replace({ hash: `#${tabId}` })
  }
}

const setActiveTab = async (tabId: string) => {
  if (tabId === activeTabId.value) return

  activeTabId.value = tabId
  await syncHash(tabId)
}

const onTabClick = async (tabId: string) => {
  if (tabId === activeTabId.value) return
  await setActiveTab(tabId)
}

defineExpose({
  activeTabId,
  setActiveTab,
})
</script>

<template>
  <div>
    <div
      role="tablist"
      :aria-label="resolvedAriaLabel"
      :class="tabListClass ?? ['mb-8 flex justify-center', rootClass]"
    >
      <button
        v-for="tab in tabs"
        :key="tab.id"
        :id="`tab-${tab.id}`"
        type="button"
        @click="onTabClick(tab.id)"
        role="tab"
        :aria-selected="isActive(tab.id)"
        :aria-controls="`panel-${tab.id}`"
        :tabindex="isActive(tab.id) ? 0 : -1"
        :class="[
          tabItemClass ?? 'text-txtPrimaryDark px-6 py-2 relative',
          isActive(tab.id) && (activeTabItemClass ?? 'active'),
        ]"
      >
        {{ tab.label }}
      </button>
    </div>
    <div v-if="activeTabComponent">
      <slot
        :name="activeTabComponent.id"
        :id="`panel-${activeTabComponent.id}`"
        role="tabpanel"
        :aria-labelledby="`tab-${activeTabComponent.id}`"
      >
        <component :is="activeTabComponent.component" />
      </slot>
    </div>
  </div>
</template>

<style scoped>
.active {
  @apply text-primary;
}

.active::after {
  content: '';
  position: absolute;
  left: 0;
  bottom: 0;
  width: 100%;
  height: 2px;
  background-color: currentColor;
}
</style>
