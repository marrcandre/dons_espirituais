<template>
	<main
		class="app-page"
		:class="`container-${layout}`"
		role="main"
	>
		<slot />
	</main>
</template>

<script setup lang="ts">
withDefaults(
	defineProps<{
		layout?: 'default' | 'reading' | 'form'
	}>(),
	{
		layout: 'default',
	},
)
</script>

<style>
.app-page {
	width: 100%;
}
</style>
