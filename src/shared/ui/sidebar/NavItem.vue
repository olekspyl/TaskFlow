<script setup lang="ts">
import { computed } from 'vue'
import { RouterLink } from 'vue-router'
import { useI18n } from 'vue-i18n'
import { NavigationTypes } from '@/shared/types'
import { VIcon } from '@/shared/ui/common'
import { navItems } from '@/shared/constants'
import { useUserStore } from '@/shared/stores'

const { t } = useI18n()

type Props = {
  items?: NavigationTypes.NavItem | NavigationTypes.NavItem[]
  do?: 'action' | 'navigation'
  onClick?: (item: NavigationTypes.NavItem) => void
}

// sidebar do dummy - get the array., make util for creating that arr
const props = withDefaults(defineProps<Props>(), {
  do: 'navigation',
})

const userStore = useUserStore()

const itemsArr = computed<NavigationTypes.NavItem[]>(() => {
  const items = props.items ? (Array.isArray(props.items) ? props.items : [props.items]) : navItems

  return items.filter((item) => {
    if (item.adminOnly && userStore.role !== 'admin') return false
    return !item.permission || userStore.canRead(item.permission)
  })
})

const componentTag = computed(() => {
  return props.do === 'action' ? 'button' : RouterLink
})

const getComponentProps = (item: NavigationTypes.NavItem) => {
  if (props.do === 'action') {
    return {
      type: 'button' as const,
    }
  }
  return {
    to: { name: item.to },
  }
}

const handleClick = (item: NavigationTypes.NavItem) => {
  if (props.do === 'action') {
    props.onClick?.(item)
  }
}

const getTitle = (item: NavigationTypes.NavItem): string => {
  return item.titleKey ? t(item.titleKey) : (item.title ?? '')
}
</script>

<template>
  <component
    :is="componentTag"
    v-for="item in itemsArr"
    :key="`${props.do}-${item.titleKey ?? item.title}`"
    v-bind="getComponentProps(item)"
    class="link group flex w-full items-center gap-[9px] rounded-[7px] px-2 py-[7px] text-txtSecondaryDark"
    :aria-label="getTitle(item)"
    @click="handleClick(item)"
  >
    <slot name="icon" :item="item">
      <VIcon :icon="item.img" :size="14" />
    </slot>

    <span class="truncate leading-[1.3]">
      {{ getTitle(item) }}
    </span>
  </component>
</template>

<style scoped lang="scss">
.link {
  @apply hover:bg-secondaryBgDark hover:text-txtPrimaryDark;
  @apply active:bg-secondaryBgDark active:shadow-sidebarActive;

  &.router-link-active {
    @apply bg-secondaryBgDark shadow-sidebarActive text-txtPrimaryDark;
  }
}
</style>
