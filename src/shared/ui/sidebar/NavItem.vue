<script setup lang="ts">
import { computed } from 'vue'
import { RouterLink } from 'vue-router'
import { routerTypes } from '@/shared/types'
import VIcon from '@/shared/ui/common/VIcon.vue'

type Item = {
  img: string
  title?: string
  to?: routerTypes.RouteNames
}

type Props = {
  items?: Item | Item[]
  do?: 'action' | 'navigation'
  onClick?: (item: Item) => void
}

const props = withDefaults(defineProps<Props>(), {
  do: 'navigation',
})

enum Navigation {
  DASHBOARD = 'Dashboard',
  LOGIN = 'Login',
}

// move to parent layout, it must be shared
const navItems: Item[] = [
  {
    title: Navigation.DASHBOARD,
    img: 'lucide:home',
    to: routerTypes.RouteNames.DASHBOARD,
  },
  {
    title: Navigation.LOGIN,
    img: 'lucide:log-in',
    to: routerTypes.RouteNames.LOGIN,
  },
]

const itemsArr = computed<Item[]>(() => {
  if (!props.items) return navItems
  return Array.isArray(props.items) ? props.items : [props.items]
})

const componentTag = computed(() => {
  return props.do === 'action' ? 'button' : RouterLink
})

const getComponentProps = (item: Item) => {
  if (props.do === 'action') {
    return {
      type: 'button' as const,
    }
  }
  return {
    to: { name: item.to },
  }
}

const handleClick = (item: Item) => {
  if (props.do === 'action') {
    props.onClick?.(item)
  }
}
</script>

<template>
  <component
    :is="componentTag"
    v-for="item in itemsArr"
    :key="`${props.do}-${item.title}`"
    v-bind="getComponentProps(item)"
    class="link group flex w-full items-center gap-[9px] rounded-[7px] px-2 py-[7px] text-txtSecondaryDark"
    :aria-label="item.title"
    @click="handleClick(item)"
  >
    <slot name="icon" :item="item">
      <VIcon :icon="item.img" :size="14" />
    </slot>

    <span class="truncate leading-[1.3]">
      {{ item.title }}
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
