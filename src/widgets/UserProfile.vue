<script setup lang="ts">
import { UsersPermissionsFeature } from '@/features/users'

type Props = {
  userId: string
}
const props = defineProps<Props>()
</script>

<template>
  <UsersPermissionsFeature :userId="props.userId" />
</template>
