<script setup lang="ts">
import { VInput } from '@/shared/ui/common'
import { useLoginForm } from '../composables/useLoginForm'
import AuthCard from './AuthCard.vue'

const { state, v$, onSubmit, loading, error } = useLoginForm()

// fine case for mapping errors or for local errors
// <template #error="{ error, text }" />
</script>

<template>
  <AuthCard
    title="Welcome back"
    submitText="Log in"
    :loading="loading"
    :errorMessage="error?.message"
    @submit="onSubmit"
  >
    <template #title></template>

    <div class="auth-field">
      <label class="auth-field__label" for="auth-login-email">Email</label>
      <VInput
        id="auth-login-email"
        v-model.trim="state.email"
        type="email"
        placeholder=" "
        :validation="v$.email"
        @blur="v$.email.$touch()"
      />
    </div>

    <div class="auth-field">
      <label class="auth-field__label" for="auth-login-password">Password</label>
      <VInput
        id="auth-login-password"
        v-model.trim="state.password"
        type="password"
        placeholder=" "
        iconRight="lock"
        :validation="v$.password"
        @blur="v$.password.$touch()"
      />
    </div>
  </AuthCard>
</template>
