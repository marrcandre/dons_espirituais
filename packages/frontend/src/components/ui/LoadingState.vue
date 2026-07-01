<template>
	<v-sheet class="loading-state" rounded="lg" color="transparent" v-bind="$attrs">
		<v-progress-circular
			class="loading-state__spinner"
			:size="size"
			:width="thickness"
			color="primary"
			indeterminate
			aria-label="Carregando"
		/>

		<p v-if="message" class="helper-text text-secondary mt-sm">{{ message }}</p>
	</v-sheet>
</template>

<script setup lang="ts">
withDefaults(
	defineProps<{
		message?: string
		size?: number | string
		thickness?: number | string
	}>(),
	{
		message: undefined,
		size: 32,
		thickness: 3,
	},
)
</script>

<style>
.loading-state {
	display: flex;
	flex-direction: column;
	align-items: center;
	justify-content: center;
	text-align: center;
	width: 100%;
	min-height: 160px;
	padding: var(--space-lg);
}

.loading-state__spinner {
	flex: 0 0 auto;
}
</style>
