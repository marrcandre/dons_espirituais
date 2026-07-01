<template>
	<header class="page-header mb-lg" v-bind="$attrs">
		<div class="page-header__content">
			<h1 class="page-title text-primary">{{ title }}</h1>
			<p v-if="subtitle" class="helper-text text-secondary mt-sm">{{ subtitle }}</p>
		</div>

		<div v-if="$slots.default" class="page-header__actions">
			<slot />
		</div>
	</header>
</template>

<script setup lang="ts">
withDefaults(
	defineProps<{
		title: string
		subtitle?: string
	}>(),
	{
		subtitle: undefined,
	},
)
</script>

<style>
.page-header {
	display: flex;
	flex-wrap: wrap;
	align-items: flex-start;
	justify-content: space-between;
	gap: var(--space-md);
}

.page-header__content {
	min-width: 0;
}

.page-header__actions {
	display: flex;
	align-items: center;
	gap: var(--space-sm);
}
</style>
