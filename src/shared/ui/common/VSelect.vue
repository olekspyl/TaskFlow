<script setup lang="ts">
import { computed } from 'vue'
import Multiselect from 'vue-multiselect'
import 'vue-multiselect/dist/vue-multiselect.css'
import { selectTypes } from '@/shared/types'

const props = defineProps<{
  options: selectTypes.Option[]
  label: string
  trackBy?: string
  errors?: string[]
  searchable?: boolean
  'allow-empty'?: boolean
  placeholder?: string
  'select-label'?: string
  'selected-label'?: string
  'deselect-label'?: string
}>()

const trackBy = computed(() => props.trackBy ?? 'value')
const searchable = computed(() => props.searchable ?? false)
const allowEmpty = computed(() => props['allow-empty'] ?? false)
const placeholder = computed(() => props.placeholder ?? '')
const selectLabel = computed(() => props['select-label'] ?? '')
const selectedLabel = computed(() => props['selected-label'] ?? '')
const deselectLabel = computed(() => props['deselect-label'] ?? '')

const model = defineModel<selectTypes.Option>()
const emit = defineEmits<{
  select: [option: selectTypes.Option]
}>()
</script>
// add attrs to multiselect // label can be different // add error case // стилі
<template>
  <div class="flex items-center gap-6">
    <label class="block shrink-0">
      <slot>
        {{ props.label }}
      </slot>
    </label>

    <Multiselect
      v-model="model"
      class="role-select"
      :track-by="trackBy"
      label="label"
      :options="props.options"
      :searchable="searchable"
      :allow-empty="allowEmpty"
      :placeholder="placeholder"
      :select-label="selectLabel"
      :selected-label="selectedLabel"
      :deselect-label="deselectLabel"
      @select="(option: selectTypes.Option) => emit('select', option)"
    />
    <div v-if="errors?.length" class="flex flex-col gap-1">
      <span v-for="error in errors" :key="error" class="text-uiCaption text-txtMutedLight">
        {{ error }}
      </span>
    </div>
  </div>
</template>

<style scoped>
:deep(.role-select.multiselect) {
  @apply relative max-w-max min-w-[160px] text-bodyM cursor-pointer;
}

:deep(.role-select .multiselect__tags) {
  @apply min-h-[48px] border rounded-lg py-[14px] pl-4 pr-10 bg-secondaryBg border-borderDefault transition-colors hover:border-borderHover flex items-center;
}

:deep(.role-select .multiselect__single) {
  @apply mb-0 pr-8 text-bodyM text-txtPrimary bg-transparent truncate;
}

:deep(.role-select .multiselect__placeholder) {
  @apply hidden;
}

:deep(.role-select .multiselect__select) {
  @apply absolute top-0 right-0 w-10 h-full flex items-center justify-center;
}

:deep(.role-select .multiselect__select::before) {
  display: none;
}

:deep(.role-select .multiselect__select::after) {
  content: '';
  width: 0;
  height: 0;
  border-left: 6px solid transparent;
  border-right: 6px solid transparent;
  border-top: 6px solid #a3aed0;
  position: absolute;
  right: 12px;
  top: 50%;
  transform: translateY(-50%);
}

:deep(.role-select .multiselect__content-wrapper) {
  @apply min-w-full w-full border border-borderDefault rounded-lg mt-2 bg-secondaryBg shadow-selectShadow z-50;
}

:deep(.role-select .multiselect__option) {
  @apply px-4 py-3 text-bodyM text-txtPrimary bg-secondaryBg whitespace-nowrap;
}

:deep(.role-select .multiselect__option--highlight) {
  @apply bg-primaryBg text-txtPrimary;
}

:deep(.role-select .multiselect__option--selected) {
  @apply bg-elevated text-txtPrimary font-medium shadow-selectOption;
}

:deep(.role-select .multiselect__option--selected.multiselect__option--highlight) {
  @apply border-primary shadow-focusRing;
}
</style>
