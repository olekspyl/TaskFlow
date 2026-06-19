<script setup lang="ts">
type Props = {
  userId: string
  action: string
  onAction: (action: string, userId: string) => Promise<void>
}

const props = defineProps<Props>()

const onActionClick = async () => {
  await props.onAction(props.action, props.userId)
}
</script>

<template>
  <button @click="onActionClick" type="button">
    {{ action }}
  </button>
</template>
