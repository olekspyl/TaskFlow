import { reactive, computed } from 'vue'
import useVuelidate from '@vuelidate/core'
import { useRouter } from 'vue-router'
import { helpers, required, email as emailValidator } from '@vuelidate/validators'
import { tokenManager } from '@ametie/vue-muza-use'
import useAuthRequests from '../api/useAuthRequests'
import type { LoginFormState } from '../types/auth'
import { useUserStore } from '@/shared/stores'

export const useLoginForm = () => {
  const router = useRouter()
  const { fetchLoginUser } = useAuthRequests()
  const userStore = useUserStore()
  const state = reactive<LoginFormState>({
    email: '',
    password: '',
  })
  // const serverError = ref('')
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
      await router.push('/users')
    },
    // або error.message
    // onError: async (err) => {
    //     serverError.value = err.message
    // },
  })

  const rules = computed(() => ({
    email: {
      required: helpers.withMessage('Email is required', required),
      email: helpers.withMessage('Enter a valid email', emailValidator),
    },
    password: {
      required: helpers.withMessage('Password is required', required),
      minLength: helpers.withMessage(
        'Password must be at least 8 characters',
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
