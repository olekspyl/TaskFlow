import { reactive, computed, ref } from 'vue'
import { useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'
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
  const { t } = useI18n()
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
      showSuccess(t('auth.toast.signupSuccess'))
      await router.push('/auth#login')
    },
  })

  const rules = computed(() => ({
    fullname: {
      required: helpers.withMessage(t('auth.validation.fullNameRequired'), required),
      minLength: helpers.withMessage(t('auth.validation.fullNameMinLength'), minLength(2)),
    },
    email: {
      required: helpers.withMessage(t('auth.validation.emailRequired'), required),
      email: helpers.withMessage(t('auth.validation.emailInvalid'), emailValidator),
    },
    password: {
      required: helpers.withMessage(t('auth.validation.passwordRequired'), required),
      minLength: helpers.withMessage(t('auth.validation.passwordMinLength'), minLength(8)),
    },
    confirmPassword: {
      required: helpers.withMessage(t('auth.validation.confirmPasswordRequired'), required),
      sameAsPassword: helpers.withMessage(
        t('auth.validation.passwordsMismatch'),
        sameAs(state.password),
      ),
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
