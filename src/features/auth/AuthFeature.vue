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
      <nav class="auth-nav" aria-label="Auth tabs" role="tablist">
        <button
          id="tab-login"
          class="auth-nav__item"
          :class="{ 'auth-nav__item--active': activeTab === 'login' }"
          type="button"
          role="tab"
          :aria-selected="activeTab === 'login'"
          aria-controls="panel-login"
          :tabindex="activeTab === 'login' ? 0 : -1"
          @click="setTab('login')"
        >Login</button>
        <button
          id="tab-signup"
          class="auth-nav__item"
          :class="{ 'auth-nav__item--active': activeTab === 'signup' }"
          type="button"
          role="tab"
          :aria-selected="activeTab === 'signup'"
          aria-controls="panel-signup"
          :tabindex="activeTab === 'signup' ? 0 : -1"
          @click="setTab('signup')"
        >Signup</button>
      </nav>
      <div id="panel-login" role="tabpanel" aria-labelledby="tab-login" v-if="activeTab === 'login'">
        <LoginForm />
      </div>
      <div id="panel-signup" role="tabpanel" aria-labelledby="tab-signup" v-else>
        <SignupForm />
      </div>
    </template>
  </div>
</template>
