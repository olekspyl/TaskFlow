import { reactive, toValue, type MaybeRefOrGetter } from 'vue'
import { useI18n } from 'vue-i18n'
import { useToast } from '@/shared/composables'
import { listsApi } from '../api'
import { useListsQuery } from '../stores/useListsQuery'
import { useListFormValidation } from './useListFormValidation'
import { type ListForm } from '../types/lists'

const createDefaultForm = (): ListForm => ({
  title: '',
  deadline: '',
  hexColor: '#FF5733',
})

export const useUpdateList = (listId: MaybeRefOrGetter<string | null>) => {
  const { t } = useI18n()
  const { updateListById } = listsApi()
  const { showSuccess } = useToast()
  const { myListsCacheKey } = useListsQuery()

  const updateListForm = reactive<ListForm>(createDefaultForm())
  const v$ = useListFormValidation(updateListForm)

  const { loading: updateListLoading, execute: executeUpdateList } = updateListById(
    () => toValue(listId),
    {
      lazy: true,
      invalidateCache: toValue(myListsCacheKey) ?? [],
      data: () => ({
        title: updateListForm.title,
        deadline: updateListForm.deadline,
        hexColor: updateListForm.hexColor,
      }),

      onSuccess: () => {
        showSuccess(t('lists.toast.updated'))
      },
    },
  )

  const fillUpdateListForm = (values: ListForm): void => {
    updateListForm.title = values.title
    updateListForm.deadline = values.deadline
    updateListForm.hexColor = values.hexColor
  }

  const resetUpdateListForm = (): void => {
    Object.assign(updateListForm, createDefaultForm())
  }

  return {
    updateListForm,
    updateListLoading,
    fillUpdateListForm,
    resetUpdateListForm,
    executeUpdateList,
    v$,
  }
}
