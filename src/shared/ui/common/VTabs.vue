<script setup lang="ts">
import { computed, ref, useAttrs, watch, type ClassValue } from 'vue'
import { useRouter, useRoute } from 'vue-router'

const router = useRouter()
const route = useRoute()
const attrs = useAttrs()

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
}

const { tabs, tabSelectionMode = 'auto', useHash = true, defaultTab } = defineProps<Props>()

const activeTabId = ref(route.hash || defaultTab)
const activeTabComponent = computed(() => tabs.find((t) => t.id === activeTabId.value) ?? tabs[0])

const rootClass = computed(() => attrs.class as ClassValue | undefined)

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
    <div role="tablist" aria-label="Tabs" class="mb-8 flex justify-center" :class="rootClass">
      <button
        v-for="tab in tabs"
        :key="tab.id"
        :id="`tab-${tab.id}`"
        type="button"
        @click="onTabClick(tab.id)"
        :class="{ active: isActive(tab.id) }"
        role="tab"
        :aria-selected="isActive(tab.id)"
        :aria-controls="`panel-${tab.id}`"
        :tabindex="isActive(tab.id) ? 0 : -1"
        class="text-txtPrimaryDark px-6 py-2 relative"
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
