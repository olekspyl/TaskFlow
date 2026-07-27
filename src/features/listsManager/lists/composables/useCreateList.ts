import { reactive, toValue } from 'vue'
import { useI18n } from 'vue-i18n'
import { useToast } from '@/shared/composables'
import { listsApi } from '../api'
import { useListsQuery } from '../stores/useListsQuery'
import { useListFormValidation } from './useListFormValidation'

export const useCreateList = () => {
  const { t } = useI18n()
  const { postNewList } = listsApi()
  const { showSuccess } = useToast()
  const { myListsCacheKey } = useListsQuery()

  const createListForm = reactive({
    title: '',
    deadline: '',
    hexColor: '#FF5733',
  })

  const v$ = useListFormValidation(createListForm)

  const { loading: createListLoading, execute: executeCreateList } = postNewList({
    lazy: true,
    invalidateCache: toValue(myListsCacheKey) ?? [],
    data: () => ({
      title: createListForm.title,
      deadline: createListForm.deadline,
      hexColor: createListForm.hexColor,
    }),

    onSuccess: () => {
      showSuccess(t('lists.toast.created'))
    },
  })

  const resetCreateListForm = (): void => {
    createListForm.title = ''
    createListForm.deadline = ''
    createListForm.hexColor = '#FF5733'
  }

  return {
    createListForm,
    createListLoading,

    executeCreateList,
    resetCreateListForm,
    v$,
  }
}
