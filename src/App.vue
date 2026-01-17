<template>
	<HTML3D ref="world">
		<DebugCube :transform="new Transform(1400, 1600, 0, 0, 90, 0)"> </DebugCube>
		<ModelFocusScreen ref="billboard" :transform="new Transform(0, 0, 600, 0, 0, 0)">
			<PortfolioCarousel> </PortfolioCarousel>
		</ModelFocusScreen>
		<ModelSign
			ref="FunSign"
			:transform="new Transform(400, 100, 0, 0, -30, 0)"
			style="
				background-color: rgb(158, 76, 30);
				border: 2px solid rgb(128, 46, 0);
				color: rgb(233, 206, 154);
			"
		>
			<div class="signText" style="padding: 10px">
				<div class="signTitle">Did you know?</div>
				<div v-if="isFocused">
					Modern Web browsers are pretty much 3D game engines at this point.
					<div class="signButton"><button @click="moveBack">Wanna see?</button></div>
				</div>
				<div v-else>
					The 3D world is really scary...
					<div class="signButton"><button @click="focusDiv">Take me back!</button></div>
				</div>
			</div>
		</ModelSign>

		<ModelSign
			:transform="new Transform(1200, 2000, 100, 0, -110, 0)"
			style="
				background-color: rgb(158, 76, 30);
				border: 2px solid rgb(128, 46, 0);
				color: rgb(233, 206, 154);
			"
		>
			<div class="signText" style="padding: 10px">
				<div class="signTitle">Did you know?</div>
				You can move the camera by right clicking and dragging. WASD to move around.
			</div>
		</ModelSign>
	</HTML3D>
</template>

<script setup lang="ts">
import HTML3D from './components/HTML3D/HTML3D.vue';
import DebugCube from './components/HTML3D/objects/DebugCube.vue';
import ModelFocusScreen from './components/HTML3D/objects/ModelFocusScreen.vue';
import ModelSign from './components/HTML3D/objects/ModelSign.vue';
import { useTemplateRef, onMounted, ref } from 'vue';
import { Transform, Vector, Angle } from './components/HTML3D/Transform';
import PortfolioCarousel from './components/portfolioProjects/PortfolioCarousel.vue';

const world = useTemplateRef('world');
const billboard = useTemplateRef('billboard');
const funSign = useTemplateRef('FunSign');
const isFocused = ref(true);
let once = true;

function draw() {
	requestAnimationFrame(draw);

	if (world.value) {
		world.value.render();
		world.value.tick();

		if (once && updateSignPosition()) {
			once = false;
		}

		if (billboard.value) {
			isFocused.value = billboard.value.isFocused();
		}
	}
}
requestAnimationFrame(draw);

onMounted(() => {
	window.addEventListener('resize', updateSignPosition);
});

function updateSignPosition() {
	if (billboard.value && funSign.value) {
		billboard.value.transform.setPositionZ(window.innerHeight / 2 + 100);
		funSign.value.transform.setPositionX(window.innerWidth / 2 - 150);
		if (billboard.value.isFocused() || once) {
			billboard.value.focus(true);
		}
		return true;
	}
	return false;
}

function focusDiv() {
	if (!billboard.value) {
		return;
	}
	billboard.value.focus();
}

function moveBack() {
	if (!billboard.value) {
		return;
	}
	billboard.value.unfocus(new Vector(0, 800, 0));
	setTimeout(() => {
		if (world.value) {
			world.value.cineMoveCamera(1, undefined, new Angle(90, 90, 0));
		}
	}, 2000);
}
</script>

<style>
@import './theme.css';

.signTitle {
	text-decoration: underline;
	font-size: 1.5rem;
	margin-bottom: 10px;
	text-align: center;
}
.signText {
	font-family: 'Times New Roman', Times, serif;
}
.signButton {
	text-align: center;
}
.signButton button {
	background-color: var(--accent-color);
	border: 1px solid var(--accent-color);
	box-shadow: rgba(0, 0, 0, 0.1) 0 2px 4px 0;
	box-sizing: border-box;
	color: #fff;
	cursor: pointer;
	font-family:
		'Akzidenz Grotesk BQ Medium',
		-apple-system,
		BlinkMacSystemFont,
		sans-serif;
	font-size: 12px;
	font-weight: 400;
	outline: none;
	outline: 0;
	padding: 5px 15px;
	text-align: center;
	transform: translateY(0);
	margin: 10px;
}
</style>
