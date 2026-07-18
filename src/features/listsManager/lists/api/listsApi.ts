import { type MaybeRefOrGetter, toValue } from 'vue'
import {
  useApi,
  useApiPost,
  useApiPatch,
  useApiDelete,
  type UseApiOptions,
} from '@ametie/vue-muza-use'
import type {
  ListsResponse,
  CreateListResponse,
  ListByIdResponse,
  UpdateListResponse,
  DeleteListResponse,
} from '../types/lists'
export default () => {
  const getLists = (options?: UseApiOptions<ListsResponse>) => {
    return useApi('/lists', options)
  }

  const postNewList = (options?: UseApiOptions<CreateListResponse>) => {
    return useApiPost('/lists', options)
  }

  const getListById = (
    id: MaybeRefOrGetter<string | null>,
    options?: UseApiOptions<ListByIdResponse>,
  ) => {
    return useApi(() => `/lists/${toValue(id)}`, options)
  }

  const updateListById = (
    id: MaybeRefOrGetter<string | null>,
    options?: UseApiOptions<UpdateListResponse>,
  ) => {
    return useApiPatch(() => `/lists/${toValue(id)}`, options)
  }

  const deleteListById = (
    id: MaybeRefOrGetter<string | null>,
    options?: UseApiOptions<DeleteListResponse>,
  ) => {
    return useApiDelete(() => `/lists/${toValue(id)}`, options)
  }

  return {
    getLists,
    postNewList,
    getListById,
    updateListById,
    deleteListById,
  }
}
