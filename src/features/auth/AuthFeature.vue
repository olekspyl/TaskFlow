<script setup lang="ts">
import { ref } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import LoginForm from './components/LoginForm.vue'
import SignupForm from './components/SignupForm.vue'
import VLoader from '@/shared/ui/common/VLoader.vue'
import { useUserStore } from '@/shared/stores'

const userStore = useUserStore()
const router = useRouter()
const route = useRoute()

type Tab = 'login' | 'signup'
const activeTab = ref<Tab>(route.hash === '#signup' ? 'signup' : 'login')

const setTab = async (tab: Tab) => {
  if (activeTab.value === tab) return
  activeTab.value = tab
  await router.replace({ hash: `#${tab}` })
}
</script>

<template>
  <div class="auth-card">
    <VLoader v-if="userStore.fetchUserLoading" size="section" />
    <template v-else>
      <nav class="auth-nav" aria-label="Auth tabs">
        <button
          class="auth-nav__item"
          :class="{ 'auth-nav__item--active': activeTab === 'login' }"
          type="button"
          @click="setTab('login')"
        >Login</button>
        <button
          class="auth-nav__item"
          :class="{ 'auth-nav__item--active': activeTab === 'signup' }"
          type="button"
          @click="setTab('signup')"
        >Signup</button>
      </nav>
      <LoginForm v-if="activeTab === 'login'" />
      <SignupForm v-else />
    </template>
  </div>
</template>
