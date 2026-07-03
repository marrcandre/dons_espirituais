<template>
	<v-alert
		:type="type"
		:variant="variant"
		:density="density"
		:rounded="rounded"
		:icon="icon"
		v-bind="$attrs"
	>
		<slot />
	</v-alert>
</template>

<script setup lang="ts">
withDefaults(
	defineProps<{
		type: 'info' | 'success' | 'warning' | 'error'
		variant?: 'text' | 'tonal' | 'outlined' | 'plain'
		density?: 'compact' | 'comfortable' | 'default'
		rounded?: string | number | boolean
		icon?: string
	}>(),
	{
		variant: 'tonal',
		density: 'default',
		rounded: 'lg',
		icon: undefined,
	},
)
</script>
