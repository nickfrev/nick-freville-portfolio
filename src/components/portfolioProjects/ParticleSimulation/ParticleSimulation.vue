<template>
	<div class="flexCol">
		<div class="flexRow">
			<canvas ref="canvas" class="canvas" :width="width" :height="height"
				>Your Browser does not support HTML5</canvas
			>
		</div>
		<div class="flexRow">
			<button @click="decreaseCount">-</button>
			<span class="displayValue">{{ spawnCount }}</span>
			<button @click="increaseCount">+</button>
		</div>
	</div>
</template>

<script setup lang="ts">
import { onMounted, useTemplateRef, ref } from 'vue';
import PowderEngine from './src/main.js';

const canvas = useTemplateRef('canvas');
const spawnCount = ref(2);
let engine: null | PowderEngine = null;

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
	engine = new PowderEngine(canvas.value);
	engine.start();
});

function increaseCount() {
	spawnCount.value++;
	if (spawnCount.value > 10) {
		spawnCount.value = 10;
	}
	engine.spawnCount = spawnCount.value;
}

function decreaseCount() {
	spawnCount.value--;
	if (spawnCount.value < 0) {
		spawnCount.value = 0;
	}
	engine.spawnCount = spawnCount.value;
}
</script>

<style scoped>
@import '../global.css';

.canvas {
	box-shadow: 0px 0px 2px var(--outline-color);
}

.flexCol {
	display: flex;
	flex-direction: column;
	justify-content: center;
}

.flexRow {
	display: flex;
	flex-direction: row;
	justify-content: center;
}

.output {
	background-color: white;
}
</style>
