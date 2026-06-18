<script setup lang="ts">
import { VInput } from '@/shared/ui/common'
import { useSignupForm } from '../composables/useSignupForm'
import AuthCard from './AuthCard.vue'

const { state, v$, onSubmit, error, serverErrors, loading } = useSignupForm()
</script>

<template>
  <AuthCard
    title="Create your account"
    submitText="Sign up"
    :loading="loading"
    :error-message="error?.message"
    @submit="onSubmit"
  >
    <template #title></template>

    <div class="auth-field">
      <label class="auth-field__label" for="auth-signup-name">Full Name</label>
      <VInput
        id="auth-signup-name"
        v-model.trim="state.fullname"
        type="text"
        placeholder=" "
        :validation="v$.fullname"
        @blur="v$.fullname.$touch()"
      />
    </div>

    <div class="auth-field">
      <label class="auth-field__label" for="auth-signup-email">Email</label>
      <VInput
        id="auth-signup-email"
        v-model.trim="state.email"
        type="email"
        placeholder=" "
        :validation="v$.email"
        @blur="v$.email.$touch()"
      />
    </div>

    <div class="auth-field">
      <label class="auth-field__label" for="auth-signup-password">Password</label>
      <VInput
        id="auth-signup-password"
        v-model.trim="state.password"
        type="password"
        placeholder=" "
        iconRight="lock"
        :validation="v$.password"
        @blur="v$.password.$touch()"
      />
    </div>

    <div class="auth-field">
      <label class="auth-field__label" for="auth-signup-confirm">Confirm Password</label>
      <VInput
        id="auth-signup-confirm"
        v-model.trim="state.confirmPassword"
        type="password"
        placeholder=" "
        iconRight="lock"
        :validation="v$.confirmPassword"
        @blur="v$.confirmPassword.$touch()"
      />
    </div>
  </AuthCard>
</template>
