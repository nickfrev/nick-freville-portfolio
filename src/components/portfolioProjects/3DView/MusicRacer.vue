<template>
	<div>
		<canvas ref="canvas" class="canvas" :width="width" :height="height">
			Your Browser does not support HTML5
		</canvas>
		<div class="audioBox" :style="{ width: `${width}px` }">
			<audio ref="audioControls"></audio>
			<input ref="audio_file" type="file" accept="audio/*" />
			<a href="https://www.youtube.com/watch?v=GDgCao2tkyg">Isaac Miell - Dial up modem remix</a>
		</div>
	</div>
</template>

<script setup lang="ts">
import { onMounted, useTemplateRef } from 'vue';
import MusicRacer from './src/musicRacer/main.js';
import song from './src/musicRacer/song.mp3';

const canvas = useTemplateRef('canvas');
const audioFile = useTemplateRef('audio_file');
const audioBox = useTemplateRef('audioControls');

defineProps({
	width: {
		type: Number,
		default: 1000,
	},
	height: {
		type: Number,
		default: 600,
	},
});

onMounted(() => {
	new MusicRacer(canvas.value, audioFile.value, audioBox.value, song);
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
