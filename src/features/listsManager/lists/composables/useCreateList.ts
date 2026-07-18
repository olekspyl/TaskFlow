import { reactive } from 'vue'

import { useToast } from '@/shared/composables'

import { listsApi } from '../api'

const LISTS_AUTO_CACHE_PREFIX = 'auto:GET:/lists:'

export const useCreateList = () => {
  const { postNewList } = listsApi()
  const { showSuccess } = useToast()

  const createListForm = reactive({
    title: 'test 10',
    deadline: '2023-12-31T23:59:59.000Z',
    hexColor: '#FF5733',
  })

  const { loading: createListLoading, execute: executeCreateList } = postNewList({
    lazy: true,

    invalidateCache: {
      prefix: LISTS_AUTO_CACHE_PREFIX,
    },

    data: () => ({
      title: createListForm.title,
      deadline: createListForm.deadline,
      hexColor: createListForm.hexColor,
    }),

    onSuccess: () => {
      showSuccess('New list has been created')
    },
  })

  const createList = async (): Promise<void> => {
    await executeCreateList()
  }

  const resetCreateListForm = (): void => {
    createListForm.title = ''
    createListForm.deadline = ''
    createListForm.hexColor = '#FF5733'
  }

  return {
    createListForm,
    createListLoading,

    createList,
    resetCreateListForm,
  }
}
