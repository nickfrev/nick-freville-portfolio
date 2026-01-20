<template>
	<GridCarousel
		@click="handleClick"
		:items="[
			{ title: 'Curtain Simulator', value: 'CurtainSimulator', image: IconCurtainSimulator },
			{ title: '3D View', value: '3DView', image: Icon3DView },
			{ title: '404', value: '404', image: Icon404 },
			{ title: 'Lock Patent', value: 'LockPatent', image: IconLockPatent },
			{ title: 'Particle Simulator', value: 'ParticleSim', image: IconParticleSim },
			{ title: 'Serial Pump', value: 'SerialPump', image: IconSerialPump },
			{ title: 'Signed Distance Function Shader', value: 'SDF', image: IconSDF },
			{ title: 'Music Game', value: 'MusicGame', image: IconMusicGame },
			{ title: 'Terminal', value: 'Terminal', image: IconTerminal },
			{ title: 'Powder Engine', value: 'PowderEngine', image: IconPowderEngine },
			{
				title: 'Background Generator',
				value: 'BackgroundGenerator',
				image: IconBackgroundGenerator,
			},
			{ title: 'Vector Field Path Finding', value: 'VectorField', image: IconVectorField },
			{ title: 'Snake 4D', value: 'Snake4D', image: IconSnake4D },
			{ title: 'Maze Generator', value: 'Maze', image: IconMaze },
			// { title: 'Hex World', value: 'HexWorld', image: IconHexWorld },
			// { title: 'Pixel Grab Game', value: 'PixelGrab', image: IconPixelGrab },
			// { title: 'Cyclic World', value: 'CyclicWorld', image: IconCyclicWorld },
		]"
	>
	</GridCarousel>

	<div ref="modal" class="modal" popover @mousedown="consumeRightClick">
		<button class="closeButton" @click="closeModal">X</button>

		<div class="modal-container" v-if="currentDemo === '3DView'">
			<Article3DView></Article3DView>
		</div>

		<div class="modal-container" v-if="currentDemo === 'BackgroundGenerator'">
			<ArticleBackgrounds></ArticleBackgrounds>
		</div>

		<div class="modal-container" v-if="currentDemo === 'CurtainSimulator'">
			<ArticleCurtainSimulator></ArticleCurtainSimulator>
		</div>

		<div class="modal-container" v-if="currentDemo === 'CyclicWorld'">
			<h1 style="color: white">Cyclic World</h1>
			TODO
			<article>
				This is an idea that I have always enjoyed, the cyclic world. A game map which just repeats
				over and over no matter how far you run away. The city has randomly generated roads and is
				filled with randomly placed and constructed buildings. This was just a proof of concept of
				implementing a previously implemented version of this but using hexagons instead of squares.
				The original square cyclic city can be seen in the video below.
			</article>
			<iframe
				class="youtubeVideo"
				src="https://www.youtube.com/embed/zj_6GtQRtwA?si=RHme3TBKOJ7ezJTL"
				title="2012 Student Expo at SUNY Fredonia"
				frameborder="0"
				allow="
					accelerometer;
					autoplay;
					clipboard-write;
					encrypted-media;
					gyroscope;
					picture-in-picture;
					web-share;
				"
				referrerpolicy="strict-origin-when-cross-origin"
				allowfullscreen
			></iframe>
		</div>

		<div class="modal-container" v-if="currentDemo === 'HexWorld'">
			<h1 style="color: white">Hex World</h1>
			<article></article>
		</div>

		<div class="modal-container" v-if="currentDemo === 'Maze'">
			<ArticleMazeGenerator></ArticleMazeGenerator>
		</div>

		<div class="modal-container" v-if="currentDemo === 'ParticleSim'">
			<ArticleParticleSimulator></ArticleParticleSimulator>
		</div>

		<div class="modal-container" v-if="currentDemo === 'PixelGrab'">
			<h1 style="color: white">Pixel Grab Game</h1>
			<article></article>
		</div>

		<div class="modal-container" v-if="currentDemo === 'PowderEngine'">
			<ArticlePowderEngine></ArticlePowderEngine>
		</div>

		<div class="modal-container" v-if="currentDemo === 'Snake4D'">
			<h1 style="color: white">Snake 4D</h1>
			<iframe
				class="youtubeVideo"
				src="https://www.youtube.com/embed/g_Fm2ctAopA?si=obmXR3rU37j6LBQk"
				title="YouTube video player"
				frameborder="0"
				allow="
					accelerometer;
					autoplay;
					clipboard-write;
					encrypted-media;
					gyroscope;
					picture-in-picture;
					web-share;
				"
				referrerpolicy="strict-origin-when-cross-origin"
				allowfullscreen
			></iframe>
			<article>
				This is a game that take the classic game Snake and brings it into the third dimension. The
				title is Snake 4D because there is also the ability to slow and reverse time, however; that
				is not shown in this video. The idea of the game is to collect the glowing particles which
				will add segments to the players snake, while avoiding running into any objects in the level
				or your growing tail.
			</article>
		</div>

		<div class="modal-container" v-if="currentDemo === 'Terminal'">
			<ArticleTerminal></ArticleTerminal>
		</div>

		<div class="modal-container" v-if="currentDemo === 'VectorField'">
			<ArticleVectorField></ArticleVectorField>
		</div>

		<div class="modal-container" v-if="currentDemo === 'MusicGame'">
			<ArticleMusicGame></ArticleMusicGame>
		</div>

		<div class="modal-container" v-if="currentDemo === '404'">
			<Article404></Article404>
		</div>

		<div class="modal-container" v-if="currentDemo === 'LockPatent'">
			<ArticleLockPatent></ArticleLockPatent>
		</div>

		<div class="modal-container" v-if="currentDemo === 'SerialPump'">
			<ArticleSerialPump></ArticleSerialPump>
		</div>

		<div class="modal-container" v-if="currentDemo === 'SDF'">
			<ArticleSDF></ArticleSDF>
		</div>
	</div>
</template>

<script setup lang="ts">
import GridCarousel from './GridCarousel.vue';
import { onMounted, ref, useTemplateRef } from 'vue';
import type { Ref } from 'vue';

import ArticleParticleSimulator from './ArticleParticleSimulator.vue';
import Article3DView from './Article3DView.vue';
import ArticleCurtainSimulator from './ArticleCurtainSimulator.vue';
import ArticleBackgrounds from './ArticleBackgrounds.vue';
import ArticleMusicGame from './ArticleMusicGame.vue';
import Article404 from './Article404.vue';
import ArticleMazeGenerator from './ArticleMazeGenerator.vue';
import ArticlePowderEngine from './ArticlePowderEngine.vue';
import ArticleVectorField from './ArticleVectorField.vue';
import ArticleLockPatent from './ArticleLockPatent.vue';
import ArticleSerialPump from './ArticleSerialPump.vue';
import ArticleSDF from './ArticleSDF.vue';
import ArticleTerminal from './ArticleTerminal.vue';

import Icon3DView from '../../assets/portfolioIcons/3dView.png';
import IconBackgroundGenerator from '../../assets/portfolioIcons/background1.png';
import IconCurtainSimulator from '../../assets/portfolioIcons/curSim.png';
import IconCyclicWorld from '../../assets/portfolioIcons/cyclicWorld.png';
import IconHexWorld from '../../assets/portfolioIcons/hexWorld.png';
import IconMaze from '../../assets/portfolioIcons/maze.png';
import IconParticleSim from '../../assets/portfolioIcons/particleSim.png';
import IconMusicGame from '../../assets/portfolioIcons/musicGame.png';
import IconPixelGrab from '../../assets/portfolioIcons/pixGrab.png';
import IconPowderEngine from '../../assets/portfolioIcons/powderEngine.png';
import IconSnake4D from '../../assets/portfolioIcons/snake4d.png';
import IconTerminal from '../../assets/portfolioIcons/terminal.png';
import IconVectorField from '../../assets/portfolioIcons/vectorFeild.png';
import Icon404 from '../../assets/portfolioIcons/404.png';
import IconLockPatent from '../../assets/portfolioIcons/lockPatent.png';
import IconSerialPump from '../../assets/portfolioIcons/serialPump.png';
import IconSDF from '../../assets/portfolioIcons/SDF.png';

const currentDemo: Ref<string | null> = ref(null);

const modal = useTemplateRef('modal');

function handleClick(title: string) {
	currentDemo.value = title;
	modal.value?.showPopover();
}

function closeModal() {
	if (modal.value) {
		modal.value.scrollTop = 0;
		modal.value.hidePopover();
	}
}

function consumeRightClick(evt: MouseEvent) {
	if (evt.button == 2) {
		evt.stopPropagation();
	}
}

onMounted(() => {
	modal.value?.addEventListener('toggle', (evt) => {
		if (evt.newState === 'closed') {
			currentDemo.value = null;
		}
	});
});
</script>

<style scoped>
@import './global.css';

.youtubeVideo {
	width: 60%;
	aspect-ratio: 1.77;
}

.closeButton {
	z-index: 99;
	position: fixed;
	top: 5%;
	right: 5%;

	width: 40px;
	height: 40px;
	padding: 5px;

	background-color: var(--danger-color);
	border-color: var(--danger-border);
}

.modal {
	position: relative;
	width: 90%;
	height: 90%;

	box-shadow: 0px 0px 20px var(--outline-color);

	background-color: rgba(0, 0, 0, 0.98);
	border-color: black;
}

.modal-container {
	display: flex;
	justify-content: center;
	align-items: center;
	flex-direction: column;
	gap: 10px;

	width: 100%;
	min-height: 100%;
}

article {
	color: white;
	max-width: 800px;

	margin: 30px;
}
</style>
