import { computed, ref, watch } from 'vue'

const isDark = ref(false)
const theme = computed(() => {
  return isDark ? 'dark' : 'light'
})

watch(isDark, (val) => {
  document.documentElement.classList.toggle('dark', val)
})

export function useTheme() {
  return { isDark, theme }
}
