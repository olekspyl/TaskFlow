<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useToast } from '@/shared/composables'

const { showSuccess } = useToast()

import { selectTypes } from '@/shared/types'
import { UsersTypes } from '@/features/users/types'
import { TableTypes } from '@/shared/ui/table'
import { Table, ActionMenu } from '@/shared/ui/table'
import { VInput, VDate, VTitle, VSelect } from '@/shared/ui/common'
import { cleanEmptyKeys } from '@/shared/utils'
import { usersApi } from '@/features/users/api'

const { fetchUsers, fetchUserById, deleteUserById } = usersApi()
const router = useRouter()

const roleOptions: selectTypes.Option[] = [
  { label: 'All roles', value: '' },
  { label: 'Admin', value: 'admin' },
  { label: 'User', value: 'user' },
]

const activeUserId = ref<string | null>(null)
const selectedRole = ref(roleOptions[0])
const totalPages = ref(1)
const pagination = ref({
  limit: 20,
  hasMore: false,
  currentPage: 1,
})
const search = ref('')
const sort = ref<TableTypes.SortingOptions>({
  sortBy: 'createdAt',
  sortOrder: 'asc',
})

const params = () =>
  cleanEmptyKeys({
    q: search.value,
    sort: sort.value.sortBy,
    order: sort.value.sortOrder,
    limit: pagination.value.limit,
    role: selectedRole?.value?.value,
  })

const {
  loading: getUsersLoading,
  data: users,
  execute: refetchUsers,
} = fetchUsers({
  params: params,
  immediate: true,
  onSuccess: () => {
    totalPages.value = users?.value?.pagination.totalPages || 1
    pagination.value.hasMore = Boolean(pagination.value.currentPage < totalPages.value)
  },
})

const { data: userData } = fetchUserById(() => activeUserId.value, {
  lazy: true,
})

const { execute: executeDeleteUser } = deleteUserById(() => activeUserId.value, {
  lazy: true,
  onSuccess: async () => {
    refetchUsers()
    showSuccess('User deleted successfully by id')
  },
})

const actions = (id: string) => [
  {
    name: UsersTypes.UserActions.PROFILE_USER,
    icon: 'lucide:user',
    execute: () => {
      activeUserId.value = id
      router.push({ path: `/users/${id}` })
    },
  },
  {
    name: UsersTypes.UserActions.DELETE_USER,
    icon: 'lucide:trash-2',
    execute: async () => {
      activeUserId.value = id
      executeDeleteUser()
    },
    style: 'dangerous',
  },
]

const columns = [
  { key: 'name', label: 'Member', width: '300px' },
  { key: 'role', label: 'Role', width: '120px', sortable: true },
  { key: 'createdAt', label: 'Registered', width: '140px', sortable: true },
  { key: 'actions', label: '', width: '32px' },
]
</script>

<template>
  <div class="fill-height flex flex-col gap-2 overflow-hidden">
    <Table
      v-model:sort="sort"
      v-model:pagination="pagination"
      :totalPages="totalPages"
      :columns="columns"
      :items="users?.data"
      :loading="getUsersLoading"
    >
      <template #toolbar>
        <VTitle text="User Management" />
        <div class="flex items-center gap-6">
          <div class="w-[320px] h-12">
            <VInput
              v-model="search"
              type="search"
              placeholder="Search by email or name"
              iconLeft="material-symbols:search"
              :debounce="1000"
            />
          </div>
          <VSelect v-model="selectedRole" :options="roleOptions" label="Role" />
        </div>
      </template>

      <template #name="{ item }">
        <div class="flex flex-col w-full items-start justify-center h-full">
          <span class="text-sm font-medium text-txtPrimary">
            {{ item.name }}
          </span>
          <span class="text-sm text-muted">
            {{ item.email }}
          </span>
        </div>
      </template>

      <template #role="{ item }">
        <span
          class="flex flex-col items-center justify-center text-sm text-txtPrimary w-full h-full"
        >
          {{ item.role }}
        </span>
      </template>
      <template #createdAt="{ item }">
        <VDate
          :date="item.createdAt"
          date-format="dd LLL yyyy"
          class="flex h-full w-full items-center justify-center text-sm text-txtPrimary"
        />
      </template>

      <template #actions="{ item }">
        <ActionMenu :actions="actions(item.id)" />
      </template>
    </Table>
  </div>
</template>
