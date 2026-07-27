<script setup lang="ts">
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { selectTypes } from '@/shared/types'
import { Table } from '@/shared/ui/table'
import { VButton, VCheckbox } from '@/shared/ui/common'
import { PermsTypes } from '@/shared/types'
import { usePermissions, useSaveUserPermissions } from '@/features/users/composables'
import { UserPanel, PermColumn } from '@/features/users/components'
import {
  createPermissionColumns,
  getPermissionCheckboxValue,
  isPermissionCheckboxDisabled,
  isPermissionCheckboxVisible,
  getPermissionsSummary,
} from '@/features/users/utils'

const { t } = useI18n()

const permissionsSetLabelKeys: Record<string, string> = {
  'list-permissions': 'users.permissionsSets.listPermissions',
  'user-management': 'users.permissionsSets.userManagement',
  'tasks-permissions': 'users.permissionsSets.tasksPermissions',
  analytics: 'users.permissionsSets.analytics',
  dashboard: 'users.permissionsSets.dashboard',
}

const getModuleLabel = (module: string): string => {
  const labelKey = permissionsSetLabelKeys[module]

  return labelKey ? t(labelKey) : module
}

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

const roleOptions = computed<selectTypes.Option[]>(() => [
  { label: t('users.roles.admin'), value: 'admin' },
  { label: t('users.roles.user'), value: 'user' },
])

const permissionColumns = computed(() =>
  createPermissionColumns(permissionActions.value, t('users.permissions.moduleColumn')),
)

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
  <div class="perms-layout flex h-full flex-col gap-4 overflow-y-auto">
    <UserPanel
      class="shrink-0"
      :loading="getUserLoading"
      :user="userData"
      :role="selectedRole"
      :role-options="roleOptions"
      :permissions-summary="permissionsSummary"
      @update:role="(option) => (selectedRole = option)"
      @select="applyRolePermissions"
    />

    <div class="rounded-2xl bg-listCardBg p-6 shadow-soft">
      <Table
        class="!gap-0 !p-0"
        :columns="permissionColumns"
        :items="permissionRows"
        :loading="getUserLoading || getRolesPermissionsLoading"
        :total-pages="1"
        :scrollable="false"
      >
        <template #toolbar>
          <span class="mb-4 block text-headingCard text-txtPrimary">{{
            t('users.permissions.matrixTitle')
          }}</span>
        </template>

        <template #module="{ item }">
          <span class="text-sm font-medium text-txtPrimary"> {{ getModuleLabel(item.module) }} </span>
        </template>

        <template v-for="action in permissionActions" #[action]="{ item }" :key="action">
          <PermColumn
            :row="item"
            :action="action"
            :visible="isPermissionCheckboxVisible(item, action)"
            :model-value="getCheckboxValue(item, action)"
            :disabled="getCheckboxDisabled(item, action)"
            @update:model-value="handleCheckboxChange(item, action, $event)"
          />
        </template>

        <template #loadMore>
          <div class="mt-4 flex w-full items-center justify-end gap-4">
            <VCheckbox
              :model-value="allPerm"
              @update:model-value="onAllPermUpdate"
              :label="t('users.permissions.allPermissionsLabel')"
              variant="switch"
              :disabled="isSelectAllDisabled()"
            />

            <VButton
              @click="saveUserPermissions"
              :disabled="patchPermissionsLoading || rolesLoading"
              :loading="rolesLoading || patchPermissionsLoading"
            >
              {{ t('users.permissions.save') }}
            </VButton>
          </div>
        </template>
      </Table>
    </div>
  </div>
</template>

<style scoped></style>
