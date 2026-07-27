import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
import useVuelidate from '@vuelidate/core'
import { helpers, required, minLength } from '@vuelidate/validators'

type ListForm = {
  title: string
  deadline: string
  hexColor: string
}

export const useListFormValidation = (form: ListForm) => {
  const { t } = useI18n()

  const rules = computed(() => ({
    title: {
      required: helpers.withMessage(t('lists.validation.titleRequired'), required),
      minLength: helpers.withMessage(t('lists.validation.titleMinLength'), minLength(2)),
    },
    hexColor: {
      required: helpers.withMessage(t('lists.validation.colorRequired'), required),
    },
    deadline: {
      required: helpers.withMessage(t('lists.validation.deadlineRequired'), required),
    },
  }))

  return useVuelidate(rules, form, {
    $autoDirty: false,
  })
}
