<template>
	<AppCard :variant="cardVariant" class="empty-state" v-bind="$attrs">
		<div class="empty-state__content text-center">
			<v-icon v-if="icon" :icon="icon" size="40" color="primary" class="empty-state__icon" />

			<h3 class="section-title text-primary">{{ title }}</h3>

			<p v-if="description" class="body-text text-secondary mt-sm">{{ description }}</p>

			<slot name="action">
				<AppButton
					v-if="actionLabel"
					class="mt-md"
					color="primary"
					variant="tonal"
					@click="emit('action')"
				>
					{{ actionLabel }}
				</AppButton>
			</slot>
		</div>
	</AppCard>
</template>

<script setup lang="ts">
import AppButton from './AppButton.vue'
import AppCard from './AppCard.vue'

withDefaults(
	defineProps<{
		icon?: string
		title?: string
		description?: string
		actionLabel?: string
		cardVariant?: 'default' | 'outlined' | 'flat' | 'compact'
	}>(),
	{
		icon: 'mdi-inbox-outline',
		title: 'Nenhum item encontrado',
		description: undefined,
		actionLabel: undefined,
		cardVariant: 'outlined',
	},
)

const emit = defineEmits<{
	action: []
}>()
</script>

<style>
.empty-state__content {
	display: flex;
	flex-direction: column;
	align-items: center;
	gap: var(--space-sm);
}

.empty-state__icon {
	margin-bottom: var(--space-xs);
}
</style>
