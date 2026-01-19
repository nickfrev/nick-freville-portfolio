<template>
	<!-- Used as a patch while I work on refactoring old projects. -->
	<iframe :src="src"></iframe>
</template>

<script setup lang="ts">
defineProps({
	src: {
		type: String,
		default: '',
	},
});
</script>

<style scoped>
iframe {
	width: 100%;
	height: 100%;
}
</style>
