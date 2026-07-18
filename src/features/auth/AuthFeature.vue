<script setup lang="ts">
import { VLoader, VTabs } from '@/shared/ui/common'
import { useUserStore } from '@/shared/stores'
import { LoginForm, SignupForm } from './components'

const userStore = useUserStore()

const tabs = [
  { id: 'login', label: 'Login' },
  { id: 'signup', label: 'Signup' },
]
</script>

<template>
  <div class="auth-card">
    <VLoader v-if="userStore.fetchUserLoading" size="section" />
    <VTabs
      v-else
      :tabs="tabs"
      default-tab="login"
      aria-label="Auth tabs"
      tab-list-class="auth-nav"
      tab-item-class="auth-nav__item"
      active-tab-item-class="auth-nav__item--active"
    >
      <template #login="{ id, role, ariaLabelledby }">
        <div :id="id" :role="role" :aria-labelledby="ariaLabelledby">
          <LoginForm />
        </div>
      </template>
      <template #signup="{ id, role, ariaLabelledby }">
        <div :id="id" :role="role" :aria-labelledby="ariaLabelledby">
          <SignupForm />
        </div>
      </template>
    </VTabs>
  </div>
</template>
