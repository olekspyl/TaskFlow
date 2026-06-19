<script setup lang="ts">
import { computed } from 'vue'
import { RouterLink } from 'vue-router'
import VIcon from './VIcon.vue'

type Props = {
  to?: string
  type?: 'submit' | 'button' | 'reset'
  iconRight?: string
  icon?: string
  text?: string
  disabled?: boolean
  loading?: boolean
  variant?: 'primary' | 'outline' | 'text' | 'warning' | 'icon'
}

const {
  to,
  type,
  iconRight,
  icon,
  text,
  loading,
  disabled,
  variant = 'primary',
} = defineProps<Props>()

const componentTag = computed(() => {
  if (to) return RouterLink
  return 'button'
})

const componentProps = computed(() => {
  if (to)
    return {
      to: disabled ? undefined : to,
      'aria-disabled': disabled ? 'true' : undefined,
      tabindex: disabled ? -1 : undefined,
    }
  return {
    type: type,
    disabled: disabled,
  }
})

const handleClick = (e: Event) => {
  if (disabled) {
    e.preventDefault()
    e.stopPropagation()
  }
}
</script>

<template>
  <component
    :is="componentTag"
    class="buttonDefault button"
    v-bind="componentProps"
    :class="[variant, { 'is-disabled': disabled }]"
    @click="handleClick"
  >
    <slot>
      <span class="py-3">
        {{ text }}
      </span>
    </slot>
    <slot name="icon">
      <VIcon v-if="icon" :icon="icon" class="text-primary" />
    </slot>
    <slot name="iconRight">
      <VIcon v-if="iconRight" :icon="iconRight" />
    </slot>
    <VIcon v-if="disabled || loading" icon="eos-icons:loading" />
  </component>
</template>

<style scoped lang="scss">
.buttonDefault {
  @apply transition-colors inline-flex items-center justify-center rounded-lg px-4 py-2 text-uiBtn transition-shadow;
}

.primary {
  &.button {
    @apply bg-activePrimary text-white;
  }

  &:not(.is-disabled):not(:disabled):hover {
    @apply bg-primary;
  }

  &.is-disabled,
  &:disabled {
    @apply bg-disabledBtn text-muted cursor-not-allowed opacity-60;
  }
}

.warning {
  &.button {
    @apply bg-dangerous text-elevated;

    &:not(.is-disabled):not(:disabled):hover {
      @apply bg-hoverDangerous;
    }

    &:not(.is-disabled):not(:disabled):active {
      @apply bg-activeDangerous;
    }

    &.is-disabled,
    &:disabled {
      @apply bg-disabledBtn text-muted cursor-not-allowed opacity-60;
    }
  }
}

.outline {
  &.button {
    @apply border border-authBorder bg-white text-primary;

    &:not(.is-disabled):not(:disabled):hover {
      @apply shadow-outlineButtonShadow;
      text-shadow:
        0 0 5px #3e4fff,
        0 0 7px #1f5aff;
    }

    &:not(.is-disabled):not(:disabled):active {
      @apply border-activePrimary text-activePrimary;
    }

    &.is-disabled,
    &:disabled {
      @apply border border-disabledBtn bg-white text-disabledBtn shadow-none cursor-not-allowed opacity-60;
      text-shadow: none;
    }
  }
}

.text {
  &.button {
    @apply bg-white text-primary;
  }
  &:not(.is-disabled):not(:disabled):hover {
    text-shadow:
      0 0 5px #3e4fff,
      0 0 7px #1f5aff;
  }

  &:not(.is-disabled):not(:disabled):hover {
    @apply text-activePrimary;
  }

  &:disabled,
  &.is-disabled {
    @apply text-disabledBtn cursor-not-allowed opacity-60;
    text-shadow: none;
  }
}

.icon.button {
  @apply text-primary;
}
</style>
