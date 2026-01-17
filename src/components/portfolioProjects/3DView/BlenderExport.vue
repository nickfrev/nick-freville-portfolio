<template>
	<canvas ref="canvas" class="canvas" :width="width" :height="height">
		Your Browser does not support HTML5
	</canvas>
</template>

<script setup lang="ts">
import { onMounted, useTemplateRef, ref } from 'vue';
import BlenderExport from './src/blenderExport/main.js';

const canvas = useTemplateRef('canvas');

defineProps({
	width: {
		type: Number,
		default: 400,
	},
	height: {
		type: Number,
		default: 200,
	},
});

onMounted(() => {
	new BlenderExport(canvas.value);
});
</script>

<style scoped>
@import '../global.css';
</style>
