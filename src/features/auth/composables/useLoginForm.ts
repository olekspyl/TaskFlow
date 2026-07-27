import { reactive, computed } from 'vue'
import useVuelidate from '@vuelidate/core'
import { useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'
import { helpers, required, email as emailValidator } from '@vuelidate/validators'
import { tokenManager } from '@ametie/vue-muza-use'
import useAuthRequests from '../api/authApi'
import type { LoginFormState } from '../types/auth'
import { useUserStore } from '@/shared/stores'

export const useLoginForm = () => {
  const { t } = useI18n()
  const router = useRouter()
  const { fetchLoginUser } = useAuthRequests()
  const userStore = useUserStore()
  const state = reactive<LoginFormState>({
    email: '',
    password: '',
  })
  const {
    execute: loginExecuter,
    loading,
    error,
  } = fetchLoginUser({
    authMode: 'public',
    lazy: true,
    data: () => ({ email: state.email, password: state.password }),
    onSuccess: async (response) => {
      tokenManager.setTokens({
        accessToken: response.data.accessToken,
        refreshToken: response.data.refreshToken,
      })
      userStore.executeUser()
      await router.push('/')
    },
    // або error.message
    // onError: async (err) => {
    //     serverError.value = err.message
    // },
  })

  const rules = computed(() => ({
    email: {
      required: helpers.withMessage(t('auth.validation.emailRequired'), required),
      email: helpers.withMessage(t('auth.validation.emailInvalid'), emailValidator),
    },
    password: {
      required: helpers.withMessage(t('auth.validation.passwordRequired'), required),
      minLength: helpers.withMessage(
        t('auth.validation.passwordMinLength'),
        (value: string) => !helpers.req(value) || value.length >= 8,
      ),
    },
  }))

  const v$ = useVuelidate(rules, state, {
    $autoDirty: false,

    //more research how to use
    // $externalResults: serverErrors,
  })

  // const resetForm = () => {
  //   state.password = ''
  //   state.email = ''
  //   serverErrors.value = {}
  //   v$.value.$reset()
  // }

  const onSubmit = async () => {
    const isValid = await v$.value.$validate()
    if (!isValid) return
    await loginExecuter()
  }

  return {
    state,
    v$,
    onSubmit,
    loading,
    error,
    // serverErrors,
  }
}
