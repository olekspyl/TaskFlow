<script setup lang="ts">
import { onBeforeUnmount, ref } from 'vue'
import { VSkeleton, VDate, VIcon } from '@/shared/ui/common'
import { selectTypes } from '@/shared/types'
import { getInitials } from '@/shared/utils'
import { UsersTypes } from '../types'

type Props = {
  user?: UsersTypes.UserResponse | null
  loading: boolean
  role?: selectTypes.Option
  roleOptions?: selectTypes.Option[]
  permissionsSummary?: { granted: number; total: number }
}

defineProps<Props>()

const emit = defineEmits<{
  'update:role': [option: selectTypes.Option]
  select: [option: selectTypes.Option]
}>()

const isRoleMenuOpen = ref(false)

const toggleRoleMenu = () => {
  isRoleMenuOpen.value = !isRoleMenuOpen.value
}

const closeRoleMenu = () => {
  isRoleMenuOpen.value = false
}

const chooseRole = (option: selectTypes.Option) => {
  closeRoleMenu()
  emit('update:role', option)
  emit('select', option)
}

document.addEventListener('click', closeRoleMenu)
onBeforeUnmount(() => document.removeEventListener('click', closeRoleMenu))
</script>

<template>
  <div
    class="flex w-full items-center justify-between gap-4 rounded-2xl bg-secondaryBg border border-borderDefault py-3 px-4"
  >
    <div class="flex items-center gap-4">
      <VSkeleton v-if="loading" width="36px" height="36px" rounded="50%" />
      <div
        v-else-if="user"
        class="flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-br from-primary to-borderHover text-uiCaption text-white"
      >
        {{ getInitials(user.name) }}
      </div>

      <div class="flex flex-col gap-1">
        <template v-if="loading">
          <VSkeleton width="140px" height="20px" />
          <VSkeleton width="220px" height="14px" />
          <VSkeleton width="160px" height="14px" />
        </template>
        <template v-else-if="user">
          <p class="text-uiHead text-txtPrimary">{{ user.name }}</p>
          <p class="text-bodyM text-muted">{{ user.email }}</p>
          <p class="text-bodyM text-muted">Member since <VDate :date="user.createdAt" /></p>
        </template>
      </div>
    </div>

    <div class="flex items-center gap-3">
      <div class="flex flex-col items-end justify-center gap-1 leading-tight">
        <template v-if="loading">
          <VSkeleton width="60px" height="20px" />
          <VSkeleton width="120px" height="14px" />
        </template>
        <template v-else-if="permissionsSummary">
          <span class="text-headingCard text-txtPrimary">
            {{ permissionsSummary.granted }} / {{ permissionsSummary.total }}
          </span>
          <span class="text-bodyM text-muted">permissions granted</span>
        </template>
      </div>

      <VSkeleton v-if="loading" width="120px" height="44px" rounded="9999px" />
      <div v-else-if="role" class="relative" @click.stop>
        <button
          type="button"
          class="flex items-center gap-3 rounded-full bg-elevated py-2 pl-2 pr-4 transition-shadow hover:shadow-focusRing focus-visible:shadow-focusRing"
          :aria-expanded="isRoleMenuOpen"
          aria-haspopup="listbox"
          @click="toggleRoleMenu"
        >
          <span
            class="flex h-9 w-9 items-center justify-center rounded-full text-white"
            :class="role.value === 'admin' ? 'bg-warning' : 'bg-primary'"
          >
            <VIcon
              :icon="role.value === 'admin' ? 'mdi:shield-account' : 'mdi:account-circle'"
              :size="18"
            />
          </span>
          <span
            class="text-uiLabel font-semibold"
            :class="role.value === 'admin' ? 'text-warning' : 'text-primary'"
          >
            {{ role.label }}
          </span>
          <VIcon
            icon="mdi:chevron-down"
            :size="14"
            class="text-muted transition-transform duration-150"
            :class="isRoleMenuOpen && 'rotate-180'"
          />
        </button>

        <Transition
          enter-active-class="transition duration-150 ease-out"
          enter-from-class="opacity-0 -translate-y-1 scale-95"
          enter-to-class="opacity-100 translate-y-0 scale-100"
          leave-active-class="transition duration-100 ease-in"
          leave-from-class="opacity-100 translate-y-0 scale-100"
          leave-to-class="opacity-0 -translate-y-1 scale-95"
        >
          <div
            v-if="isRoleMenuOpen && roleOptions?.length"
            role="listbox"
            class="absolute right-0 top-[calc(100%+6px)] z-30 flex w-[160px] flex-col gap-0.5 rounded-xl border border-borderDefault bg-secondaryBg p-1.5 shadow-taught"
          >
            <button
              v-for="option in roleOptions"
              :key="option.value"
              type="button"
              role="option"
              :aria-selected="option.value === role.value"
              class="flex items-center gap-2 rounded-lg px-2.5 py-2 text-left text-bodyM transition-colors hover:bg-elevated"
              :class="
                option.value === role.value
                  ? 'bg-elevated font-semibold text-primary'
                  : 'text-txtPrimary'
              "
              @click="chooseRole(option)"
            >
              <span
                class="flex h-[18px] w-[18px] shrink-0 items-center justify-center rounded-full text-white"
                :class="option.value === 'admin' ? 'bg-warning' : 'bg-primary'"
              >
                <VIcon
                  :icon="option.value === 'admin' ? 'mdi:shield-account' : 'mdi:account-circle'"
                  :size="11"
                />
              </span>
              {{ option.label }}
            </button>
          </div>
        </Transition>
      </div>
    </div>
  </div>
</template>

<style scoped></style>
