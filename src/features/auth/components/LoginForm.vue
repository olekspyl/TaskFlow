<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import { VInput } from '@/shared/ui/common'
import { useLoginForm } from '../composables/useLoginForm'
import { AuthCard } from '.'

const { t } = useI18n()
const { state, v$, onSubmit, loading, error } = useLoginForm()
</script>

<template>
  <AuthCard
    :title="t('auth.login.title')"
    :submitText="t('auth.login.submit')"
    :loading="loading"
    :errorMessage="error?.message"
    @submit="onSubmit"
  >
    <template #title></template>

    <div class="auth-field">
      <label class="auth-field__label" for="auth-login-email">{{ t('auth.login.emailLabel') }}</label>
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
      <label class="auth-field__label" for="auth-login-password">{{
        t('auth.login.passwordLabel')
      }}</label>
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
