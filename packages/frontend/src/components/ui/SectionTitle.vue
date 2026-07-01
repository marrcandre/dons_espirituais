<template>
	<section class="section-title-block" v-bind="$attrs">
		<div class="section-title-block__header">
			<h2 class="section-title text-primary">{{ title }}</h2>
			<p v-if="subtitle" class="helper-text text-secondary mt-xs">{{ subtitle }}</p>
		</div>

		<div v-if="$slots.default || $slots.actions" class="section-title-block__extras mt-sm">
			<slot />
			<slot name="actions" />
		</div>
	</section>
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
.section-title-block {
	display: flex;
	flex-direction: column;
	gap: var(--space-xs);
}

.section-title-block__header {
	min-width: 0;
}

.section-title-block__extras {
	display: flex;
	flex-wrap: wrap;
	align-items: center;
	gap: var(--space-sm);
}
</style>
