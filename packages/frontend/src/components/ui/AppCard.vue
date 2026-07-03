<template>
	<v-card
		class="app-card"
		:class="`app-card--${variant}`"
		:variant="resolvedVariant"
		:elevation="resolvedElevation"
		:rounded="resolvedRounded"
		v-bind="$attrs"
	>
		<div class="app-card__content" :class="{ 'app-card__content--compact': variant === 'compact', 'app-card__content--flush': variant === 'flush' }">
			<slot />
		</div>
	</v-card>
</template>

<script setup lang="ts">
import { computed } from 'vue'

type AppCardVariant = 'default' | 'outlined' | 'flat' | 'compact' | 'interactive' | 'flush'

const props = withDefaults(
	defineProps<{
		variant?: AppCardVariant
	}>(),
	{
		variant: 'default',
	},
)

const variant = computed(() => props.variant)

const resolvedVariant = computed(() => {
	if (variant.value === 'outlined') {
		return 'outlined'
	}

	if (variant.value === 'flat' || variant.value === 'compact' || variant.value === 'flush') {
		return 'flat'
	}

	return 'elevated'
})

const resolvedElevation = computed(() => {
	if (variant.value === 'default' || variant.value === 'interactive') {
		return 2
	}

	return 0
})

const resolvedRounded = computed(() => 'lg')
</script>

<style>
.app-card__content {
	padding: var(--space-lg);
}

.app-card__content--compact {
	padding: var(--space-md);
}

.app-card__content--flush {
	padding: 0;
}

.app-card--interactive {
	transition: transform var(--duration-fast, 150ms) var(--easing-standard, ease),
		box-shadow var(--duration-fast, 150ms) var(--easing-standard, ease);
	cursor: pointer;
}

.app-card--interactive:hover {
	transform: translateY(-2px);
	box-shadow: var(--shadow-lg);
}
</style>
