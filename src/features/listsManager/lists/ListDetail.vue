<script setup lang="ts">
import { computed, reactive, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { invalidateCache } from '@ametie/vue-muza-use'

import { useUserStore } from '@/shared/stores'
import { VButton, VLoader } from '@/shared/ui/common'

import { listsApi } from './api'
import { LISTS_CACHE_KEYS } from './constants/cache'

const route = useRoute()
const router = useRouter()
const userStore = useUserStore()

const { getListById, updateListById, deleteListById } = listsApi()

const listId = computed(() => route.params.id as string)

const editableState = reactive({
  title: '',
  hexColor: '',
})

const {
  data: list,
  loading: listLoading,
  error: listError,
  execute: fetchList,
} = getListById(listId, {
  immediate: true,
})

const isOwnList = computed(() => {
  return list.value?.owner.id === userStore.userState?._id
})

watch(
  list,
  (currentList) => {
    if (!currentList) {
      return
    }

    editableState.title = currentList.title
    editableState.hexColor = currentList.hexColor
  },
  { immediate: true },
)

function invalidateMyListsCache() {
  if (isOwnList.value) {
    invalidateCache(LISTS_CACHE_KEYS.MY_LISTS)
  }
}

const { loading: updateLoading, execute: updateList } = updateListById(listId, {
  lazy: true,
})

const { loading: deleteLoading, execute: deleteList } = deleteListById(listId, {
  lazy: true,
})

async function handleUpdate() {
  await updateList({
    data: {
      title: editableState.title,
      hexColor: editableState.hexColor,
    },
  })

  invalidateMyListsCache()

  // Оновлюємо саме сторінку деталей.
  await fetchList()
}

async function handleDelete() {
  await deleteList()

  invalidateMyListsCache()

  // Після переходу /lists змонтується заново.
  // Якщо це був власний список, кеш уже очищений.
  await router.push('/lists')
}
</script>

<template>
  <VLoader v-if="listLoading" size="section" />

  <div v-else-if="listError">Failed to load list</div>

  <section v-else-if="list">
    <header>
      <h1>{{ list.title }}</h1>

      <p>Owner: {{ list.owner.name }}</p>
    </header>

    <form @submit.prevent="handleUpdate">
      <label>
        Title

        <input v-model="editableState.title" type="text" />
      </label>

      <label>
        Color

        <input v-model="editableState.hexColor" type="color" />
      </label>

      <div>
        <VButton
          text="Save"
          type="submit"
          variant="primary"
          :loading="updateLoading"
          :disabled="updateLoading || deleteLoading"
        />

        <VButton
          text="Delete"
          type="button"
          variant="danger"
          :loading="deleteLoading"
          :disabled="updateLoading || deleteLoading"
          @click="handleDelete"
        />
      </div>
    </form>
  </section>
</template>
