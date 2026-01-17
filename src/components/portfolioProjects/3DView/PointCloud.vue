<template>
	<canvas ref="canvas" class="canvas" :width="width" :height="height">
		Your Browser does not support HTML5
	</canvas>
</template>

<script setup lang="ts">
import { onMounted, useTemplateRef } from 'vue';
import PointCloud from './src/pointCloud/main.js';

const canvas = useTemplateRef('canvas');

defineProps({
	width: {
		type: Number,
		default: 800,
	},
	height: {
		type: Number,
		default: 400,
	},
});

onMounted(() => {
	new PointCloud(canvas.value);
});
</script>

<style scoped>
@import '../global.css';

canvas {
	border: solid 1px white;
}
</style>
