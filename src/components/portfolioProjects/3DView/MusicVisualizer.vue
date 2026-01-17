<template>
	<div>
		<canvas ref="canvas" class="canvas" :width="width" :height="height">
			Your Browser does not support HTML5
		</canvas>
		<div class="audioBox" :style="{ width: `${width}px` }">
			<audio ref="audioControls"></audio>
			<input ref="audio_file" type="file" accept="audio/*" />
		</div>
	</div>
</template>

<script setup lang="ts">
import { onMounted, useTemplateRef } from 'vue';
import MusicVisualizer from './src/musicVisual/main.js';
import song from './src/musicVisual/song.mp3';

const canvas = useTemplateRef('canvas');
const audioFile = useTemplateRef('audio_file');
const audioBox = useTemplateRef('audioControls');

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
	new MusicVisualizer(canvas.value, audioFile.value, audioBox.value, song);
});
</script>

<style scoped>
@import '../global.css';

canvas {
	border: solid 1px white;
}

.audioBox audio {
	width: 100%;
}

.audioBox a {
	float: right;
}
</style>
