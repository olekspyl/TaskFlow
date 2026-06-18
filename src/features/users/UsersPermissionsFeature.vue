<script setup lang="ts">
import { computed } from 'vue'
import { selectTypes } from '@/shared/types'
import { PermsTypes } from '@/features/users/types'
import { Table } from '@/shared/ui/table'
import { VButton, VCheckbox, VSelect } from '@/shared/ui/common'
import { usePermissions, useSaveUserPermissions } from '@/features/users/composables'
import { UserPanel } from '@/features/users/components'
import {
  createPermissionColumns,
  getPermissionCheckboxValue,
  isPermissionCheckboxDisabled,
  isPermissionCheckboxVisible,
  getPermissionsSummary,
} from '@/features/users/utils'

const {
  userPermissions,
  getUserLoading,
  userData,
  allPerm,
  selectedRole,
  baseRole,
  getRolesPermissionsLoading,
  permissionRows,
  permissionActions,
  applyRolePermissions,
  isPermissionGroupChecked,
  togglePermissionGroup,
  isRowAdminLocked,
  onAllPermUpdate,
} = usePermissions()

const { patchPermissionsLoading, rolesLoading, saveUserPermissions } = useSaveUserPermissions({
  userPermissions,
  selectedRole,
  baseRole,
})

const roleOptions: selectTypes.Option[] = [
  { label: 'Admin', value: 'admin' },
  { label: 'User', value: 'user' },
]

const permissionColumns = computed(() => createPermissionColumns(permissionActions.value))

const permissionsSummary = computed(() => getPermissionsSummary(userPermissions.value))

const isSelectAllDisabled = () => {
  return selectedRole.value?.value === 'admin'
}

const getCheckboxValue = (row: PermsTypes.PermissionRow, action: PermsTypes.PermissionAction) => {
  return getPermissionCheckboxValue(
    selectedRole.value,
    isRowAdminLocked(row),
    isPermissionGroupChecked(row, action),
    action,
  )
}

const getCheckboxDisabled = (
  row: PermsTypes.PermissionRow,
  action: PermsTypes.PermissionAction,
) => {
  return isPermissionCheckboxDisabled(selectedRole.value, isRowAdminLocked(row), action)
}
const handleCheckboxChange = async (
  row: PermsTypes.PermissionRow,
  action: PermsTypes.PermissionAction,
  value: boolean,
) => {
  await togglePermissionGroup(row, action, value)
}
</script>

<template>
  <div class="perms-layout flex h-full flex-col overflow-hidden">
    <UserPanel
      class="shrink-0"
      :loading="getUserLoading"
      :user="userData"
      :role="selectedRole"
      :permissions-summary="permissionsSummary"
    />

    <div class="flex min-h-0 flex-1 flex-col overflow-y-auto rounded-2xl bg-secondaryBg border border-borderDefault">
      <Table
        :columns="permissionColumns"
        :items="permissionRows"
        :loading="getUserLoading || getRolesPermissionsLoading"
        :total-pages="1"
        :scrollable="false"
      >
        <template #toolbar>
          <div class="flex items-center justify-between pb-3">
            <span class="text-headingCard text-txtPrimary">Permission matrix</span>

            <div class="flex items-center gap-4">
              <VSelect
                v-model="selectedRole"
                @select="applyRolePermissions"
                :options="roleOptions"
                label="Role"
              />

              <VCheckbox
                :model-value="allPerm"
                @update:model-value="onAllPermUpdate"
                label="All permissions"
                variant="switch"
                :disabled="isSelectAllDisabled()"
              />

              <VButton
                @click="saveUserPermissions"
                :disabled="patchPermissionsLoading || rolesLoading"
                :loading="rolesLoading || patchPermissionsLoading"
              >
                Save
              </VButton>
            </div>
          </div>
        </template>

        <template #module="{ item }">
          <span class="text-sm font-medium text-txtPrimary">
            {{ item.module }}
          </span>
        </template>

        <template v-for="action in permissionActions" #[action]="{ item }" :key="action">
          <div class="flex h-full w-full items-center justify-center">
            <VCheckbox
              v-if="isPermissionCheckboxVisible(item, action)"
              label=""
              class="h-full w-full justify-center"
              :model-value="getCheckboxValue(item, action)"
              :disabled="getCheckboxDisabled(item, action)"
              @update:model-value="handleCheckboxChange(item, action, $event)"
            />
          </div>
        </template>
      </Table>
    </div>
  </div>
</template>

<style scoped></style>
