<template>
	<GridCarousel
		@click="handleClick"
		:items="[
			{ title: '3D View', value: '3DView', image: Icon3DView },
			{
				title: 'Background Generator',
				value: 'BackgroundGenerator',
				image: IconBackgroundGenerator,
			},
			{ title: 'Curtain Simulator', value: 'CurtainSimulator', image: IconCurtainSimulator },
			{ title: 'Maze', value: 'Maze', image: IconMaze },
			{ title: 'Particle Simulator', value: 'ParticleSim', image: IconParticleSim },
			{ title: 'Powder Engine', value: 'PowderEngine', image: IconPowderEngine },
			{ title: 'Snake 4D', value: 'Snake4D', image: IconSnake4D },
			{ title: 'Terminal', value: 'Terminal', image: IconTerminal },
			{ title: 'Vector Field Path Finding', value: 'VectorField', image: IconVectorField },
			{ title: 'Hex World', value: 'HexWorld', image: IconHexWorld },
			{ title: 'Pixel Grab Game', value: 'PixelGrab', image: IconPixelGrab },
			{ title: 'Cyclic World', value: 'CyclicWorld', image: IconCyclicWorld },
		]"
	>
	</GridCarousel>

	<div ref="modal" class="modal" popover @mousedown="consumeRightClick">
		<button class="closeButton" @click="closeModal">X</button>

		<div class="modal-container" v-if="currentDemo === '3DView'">
			<h1 style="color: white">3D View</h1>
			<BlenderExport></BlenderExport>
			<article>
				I've always been curious to learn how things work. As a child almost every one of my toys
				had been taken apart and reassembled a dozen times. As a programmer I have the same
				curiosity.
				<p>
					One of my hobbies is to program video games. It is one of the best things out there to
					program for someone that really wants to enjoy the act of programming. Why? Because it is
					one of the few things you can program that almost everyone will enjoy and understand. If I
					write some crazy algorithm that could tell you how to most efficiently pack variably
					shaped boxes into the back of a truck in O(1) time, most programmers would be gobsmacked.
					If I showed the same thing to my friends or family I'd probably get a courteous "Oh,
					that's nice." then the topic would change. Everyone can understand and be interested in
					something as visual as games.
				</p>
				<p>
					Having played with game engines for years I began to grow curious how they worked under
					the hood. I had picked up a fair bit of the mechanics just from working with large game
					engines like Unity, and I wanted to see if I could make something simple just using that
					knowledge. Having recently learned about the canvas tag in HTML and making a small game
					with that, I decided to see if I could make a vector 3D engine.
				</p>
				<p>The results turned out nicely:</p>
			</article>
			<EngineTest></EngineTest>
			<article>
				<p>
					I am really quite surprised with how smooth the engine worked. It only used canvas and
					some simple javascript. I really expected it to be somewhat laggy but even at the time it
					was pretty fast. The engine only uses javascript and thus it runs on the CPU but because
					it renders vectors and not a per-pixel calculation it can take advantage of having very
					few computations per frame. It only gets smoother as the years go on.
				</p>
				<p>
					Speaking of the limitations of javascript. I programed this somewhere around 2013, which
					was before classes were introduced to javascript. It was only recently, when I went back
					to update the code so that it could be used with vuejs, that I remembered that developers
					used to use functions to stand in for classes back then.
				</p>
				<img :src="FunctionClassImage" />
				<p>
					I learned a great deal from this project and I am very thankful for my mathematics
					background because the wikipedia article on 3D to 2D projection was a bit dense. As you
					look at that demo you might have the same thought as I did at the time: It sort of looks
					like a music visualizer. From that thought I created the following:
				</p>
			</article>
			<MusicVisualizer></MusicVisualizer>
			<article>
				<p>
					From there it only has one more obvious step. So with a bit of python code to help extract
					3D models from Blender3D and rewriting the engine into a more robust version with it's own
					concepts of a physics engine and "shaders", we get this:
				</p>
			</article>
			<MusicRacer></MusicRacer>
			<article>
				<p>
					Lastly just for a bit of fun I played around with the previous mention of "shaders". It
					isn't a shader in the regular terminology but it separated out the logic for how vertices
					and edges are rendered. So in this example I'm rendering all of the vertices as squares to
					create a makeshift point cloud display.
				</p>
			</article>
			<PointCloud></PointCloud>
			<article></article>
		</div>

		<div class="modal-container" v-if="currentDemo === 'BackgroundGenerator'">
			<h1 style="color: white">Background Generator</h1>
			<article></article>
		</div>

		<div class="modal-container" v-if="currentDemo === 'CurtainSimulator'">
			<h1 style="color: white">Curtain Simulator</h1>
			<article></article>
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
			<h1 style="color: white">Maze</h1>
			<article></article>
		</div>

		<div class="modal-container" v-if="currentDemo === 'ParticleSim'">
			<h1 style="color: white">Particle Simulator</h1>
			<ParticleSimulation></ParticleSimulation>
			<article>
				Physics has always been a fun thing to program for me. This is a small demo of some particle
				physics that used some behind the scenes programming to increase the efficiency of the
				physics. Rendering is reduced by drawing black particles where the current particles are on
				each screen draw so that the entire screen doesn't have to be cleared. Another method used
				is to section the screen into a matrix and track what cells the particles are in so that
				only adjacent cells have to be checked for colliding particles.
			</article>
		</div>

		<div class="modal-container" v-if="currentDemo === 'PixelGrab'">
			<h1 style="color: white">Pixel Grab Game</h1>
			<article></article>
		</div>

		<div class="modal-container" v-if="currentDemo === 'PowderEngine'">
			<h1 style="color: white">Powder Engine</h1>
			<article></article>
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
			<h1 style="color: white">Terminal</h1>
			<article></article>
		</div>

		<div class="modal-container" v-if="currentDemo === 'VectorField'">
			<h1 style="color: white">Vector Field Path Finding</h1>
			<article></article>
		</div>
	</div>
</template>

<script setup lang="ts">
import GridCarousel from './GridCarousel.vue';
import { ref, useTemplateRef } from 'vue';
import type { Ref } from 'vue';

import ParticleSimulation from './ParticleSimulation/ParticleSimulation.vue';
import BlenderExport from './3DView/BlenderExport.vue';
import EngineTest from './3DView/EngineTest.vue';
import MusicRacer from './3DView/MusicRacer.vue';
import MusicVisualizer from './3DView/MusicVisualizer.vue';
import PointCloud from './3DView/PointCloud.vue';

import Icon3DView from '../../assets/portfolioIcons/3dView.png';
import IconBackgroundGenerator from '../../assets/portfolioIcons/background1.png';
import IconCurtainSimulator from '../../assets/portfolioIcons/curSim.png';
import IconCyclicWorld from '../../assets/portfolioIcons/cyclicWorld.png';
import IconHexWorld from '../../assets/portfolioIcons/hexWorld.png';
import IconMaze from '../../assets/portfolioIcons/maze.png';
import IconParticleSim from '../../assets/portfolioIcons/particleSim.png';
import IconPixelGrab from '../../assets/portfolioIcons/pixGrab.png';
import IconPowderEngine from '../../assets/portfolioIcons/powderEngine.png';
import IconSnake4D from '../../assets/portfolioIcons/snake4d.png';
import IconTerminal from '../../assets/portfolioIcons/terminal.png';
import IconVectorField from '../../assets/portfolioIcons/vectorFeild.png';

import FunctionClassImage from '../../assets/portfilioExtras/functionClass.png';

const currentDemo: Ref<string | null> = ref(null);

const modal = useTemplateRef('modal');

function handleClick(title: string) {
	currentDemo.value = title;
	modal.value?.showPopover();
}

function closeModal() {
	modal.value?.hidePopover();
}

function consumeRightClick(evt: MouseEvent) {
	if (evt.button == 2) {
		evt.stopPropagation();
	}
}
</script>

<style scoped>
@import './global.css';

.youtubeVideo {
	width: 60%;
	aspect-ratio: 1.77;
}

.closeButton {
	position: absolute;
	top: 0px;
	right: 0px;

	width: 40px;
	height: 40px;
	padding: 5px;

	background-color: var(--danger-color);
	border-color: var(--danger-border);
}

.modal {
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
}

article {
	color: white;
	max-width: 800px;

	margin: 30px;
}
</style>
