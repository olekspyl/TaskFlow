<script setup lang="ts">
import { ref, watch, computed, useAttrs } from 'vue'
import { refDebounced } from '@vueuse/core'
import { useId } from 'vue'
import { VIcon } from '.'

type Props = {
  type?: 'password' | 'email' | 'text' | 'search'
  modelValue: string
  label?: string
  iconLeft?: string
  iconRight?: string
  customHints?: string[]
  debounce?: number
  validation?: any
}

defineOptions({ inheritAttrs: false })

//add icon left and icon right
const {
  type = 'text',
  modelValue,
  label,
  iconLeft,
  iconRight,
  customHints,
  debounce = 0,
  validation = () => [],
} = defineProps<Props>()

const emits = defineEmits<{
  (e: 'update:modelValue', value: string): void
}>()

const attrs = useAttrs()
const id = useId()

const showPassword = ref(false)
const input = ref(modelValue)
const debounced = refDebounced(input, debounce)

const hints = computed(() => {
  if (!validation) return customHints || []

  return Object.values(validation)
    .filter((rule: any) => rule?.$params?.hint)
    .map((rule: any) => rule.$params.hint)
})

const inputType = computed(() => {
  if (type !== 'password') return type
  return showPassword.value ? 'text' : 'password'
})

const onInputUpdate = (e: Event) => {
  input.value = (e.target as HTMLInputElement).value
}

watch(
  () => modelValue,
  (v) => {
    if (input.value !== v) {
      input.value = v
    }
  },
)

watch(debounced, (v) => {
  emits('update:modelValue', v)
})
</script>

<template>
  <div
    class="flex flex-col"
    :class="{ error: validation.$error, disabled: $attrs.disabled !== undefined }"
  >
    <label v-if="label || $slots.label" :for="id" class="text-uiLabel text-txtPrimaryDark mb-[6px]">
      <slot name="label">
        {{ label }}
      </slot>
    </label>
    <div class="relative flex rounded-lg focus-within:border-primary focus-within:shadow-focusRing">
      <slot name="iconLeft">
        <VIcon
          v-if="iconLeft"
          :icon="iconLeft"
          class="absolute left-4 top-1/2 -translate-y-1/2 pl-10"
        />
      </slot>
      <input :id="id" :value="input" @input="onInputUpdate" :type="inputType" v-bind="attrs" />
      <slot name="iconRight">
        <div
          v-if="type === 'password'"
          class="cursor-pointer text-muted"
          @click="showPassword = !showPassword"
        >
          <VIcon
            v-if="iconRight"
            :icon="showPassword ? 'heroicons:eye' : 'heroicons:eye-slash'"
            class="absolute right-[14px] top-[14px]"
          />
        </div>
      </slot>
    </div>
    <div v-if="hints.length || validation.$error" class="flex flex-col gap-1">
      <span v-for="hint in hints" :key="hint" class="text-uiCaption text-txtMutedLight">
        {{ hint }}
      </span>
      <span v-if="validation.$error" class="text-dangerous">{{
        validation.$errors[0]?.$message
      }}</span>
    </div>
  </div>
</template>

<style scoped lang="scss">
.error {
  label {
    @apply text-dangerous;
  }

  input {
    @apply border-dangerous;
  }
}

.disabled {
  pointer-events: none;
  input {
    @apply border-disabledBorder;
  }

  label,
  input::placeholder {
    @apply text-disabledBtn;
  }
}

input {
  @apply w-full border rounded-lg py-[14px] px-4 text-bodyM bg-secondaryBg text-txtPrimary border-borderDefault transition-colors hover:border-borderHover placeholder:text-muted focus:outline-none;
}
</style>
