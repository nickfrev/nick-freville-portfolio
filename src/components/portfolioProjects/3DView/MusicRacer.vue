<template>
	<div>
		<div>
			<button class="floatRight" @click="toggleMusicLock">
				<span v-if="mouseOverToPlay">Mouse Over To Play</span>
				<span v-else>Always On</span>
			</button>
		</div>
		<canvas ref="canvas" class="canvas" :width="width" :height="height">
			Your Browser does not support HTML5
		</canvas>
		<div class="audioBox" :style="{ width: `${width}px` }">
			<audio ref="audioControls"></audio>
			<input ref="audio_file" type="file" accept="audio/*" />
			<!-- <a href="https://www.youtube.com/watch?v=GDgCao2tkyg">Isaac Miell - Dial up modem remix</a> -->
			<a href="https://youtu.be/I3xA8RSgv58?si=oVD5sS_ATS1oYpVo">colorcolorcolor - Earth Ox</a>
		</div>
	</div>
</template>

<script setup lang="ts">
import { onMounted, useTemplateRef, ref } from 'vue';
import MusicRacer from './src/musicRacer/main.js';
import song from './src/musicRacer/colorcolorcolor - electritribe - earth ox.mp3';

const canvas = useTemplateRef('canvas');
const audioFile = useTemplateRef('audio_file');
const audioBox = useTemplateRef('audioControls');
const mouseOverToPlay = ref(true);

let musicRacer: null | MusicRacer = null;

function toggleMusicLock() {
	musicRacer.mouseOverToPlay = !musicRacer.mouseOverToPlay;
	mouseOverToPlay.value = musicRacer.mouseOverToPlay;
	if (!mouseOverToPlay.value) {
		musicRacer.start();
	} else {
		musicRacer.stop();
	}
}

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
	musicRacer = new MusicRacer(canvas.value, audioFile.value, audioBox.value, song);
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

.floatRight {
	float: right;
	margin-right: 0px;
}
</style>
