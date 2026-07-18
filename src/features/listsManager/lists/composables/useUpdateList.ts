import { reactive, toValue, type MaybeRefOrGetter } from 'vue'
import { useToast } from '@/shared/composables'
import { listsApi } from '../api'
import { LISTS_AUTO_CACHE_PREFIX } from '../constants/cache'

type UpdateListForm = {
  title: string
  deadline: string
  hexColor: string
}

const createDefaultForm = (): UpdateListForm => ({
  title: '',
  deadline: '',
  hexColor: '#FF5733',
})

export const useUpdateList = (listId: MaybeRefOrGetter<string | null>) => {
  const { updateListById } = listsApi()
  const { showSuccess } = useToast()

  const updateListForm = reactive<UpdateListForm>(createDefaultForm())

  const { loading: updateListLoading, execute: executeUpdateList } = updateListById(
    () => toValue(listId),
    {
      lazy: true,

      invalidateCache: {
        prefix: LISTS_AUTO_CACHE_PREFIX,
      },

      data: () => ({
        title: updateListForm.title,
        deadline: updateListForm.deadline,
        hexColor: updateListForm.hexColor,
      }),

      onSuccess: () => {
        showSuccess('List has been updated')
      },
    },
  )

  const updateList = async (): Promise<void> => {
    await executeUpdateList()
  }

  const fillUpdateListForm = (values: UpdateListForm): void => {
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

    updateList,
    fillUpdateListForm,
    resetUpdateListForm,
  }
}
