import { reactive, computed, ref } from 'vue'
import { useRouter } from 'vue-router'
import useVuelidate from '@vuelidate/core'
import {
  helpers,
  required,
  email as emailValidator,
  minLength,
  sameAs,
} from '@vuelidate/validators'
import { authApi } from '../api'
import type { SignupFormState } from '../types/auth'
import { useToast } from '@/shared/composables'

export const useSignupForm = () => {
  const { showSuccess } = useToast()
  const router = useRouter()
  const state = reactive<SignupFormState>({
    fullname: '',
    email: '',
    password: '',
    confirmPassword: '',
  })

  const serverErrors = ref<Record<string, string[]>>({})

  const { fetchRegisterUser } = authApi()
  const {
    loading,
    error,
    execute: registerExecutor,
  } = fetchRegisterUser({
    method: 'POST',
    lazy: true,
    authMode: 'public',
    data: () => ({ email: state.email, password: state.password, name: state.fullname }),
    onSuccess: async () => {
      resetForm()
      showSuccess('you are registered')
      await router.push('/auth#login')
    },
  })

  const rules = computed(() => ({
    fullname: {
      required: helpers.withMessage('Full name is required', required),
      minLength: helpers.withMessage('Full name must be at least 2 characters', minLength(2)),
    },
    email: {
      required: helpers.withMessage('Email is required', required),
      email: helpers.withMessage('Enter a valid email', emailValidator),
    },
    password: {
      required: helpers.withMessage('Password is required', required),
      minLength: helpers.withMessage('Password must be at least 8 characters', minLength(8)),
    },
    confirmPassword: {
      required: helpers.withMessage('Confirm password is required', required),
      sameAsPassword: helpers.withMessage('Passwords do not match', sameAs(state.password)),
    },
  }))

  const v$ = useVuelidate(rules, state, {
    $autoDirty: false,
    $externalResults: serverErrors,
  })

  const resetForm = () => {
    state.password = ''
    state.confirmPassword = ''
    state.email = ''
    state.fullname = ''
    serverErrors.value = {}
    v$.value.$reset()
  }

  const onSubmit = async () => {
    const isValid = await v$.value.$validate()
    if (!isValid) return error.value
    await registerExecutor()
  }

  return {
    state,
    v$,
    onSubmit,
    error,
    serverErrors,
    loading,
  }
}
