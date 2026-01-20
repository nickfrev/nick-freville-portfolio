<template>
	<div class="object" :style="objectStyle">
		<ModelRoom ref="room" :width="roomWidth" :height="roomHeight" :length="roomLength"></ModelRoom>
		<ModelFocusScreen ref="billboard" :transform="new Transform(0, 0, 600, 0, 0, 0)">
			<PortfolioCarousel> </PortfolioCarousel>
		</ModelFocusScreen>
		<ModelSign
			ref="focusSign"
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
					<div class="signButton"><button @click="focus()">Take me back!</button></div>
				</div>
			</div>
		</ModelSign>
	</div>
</template>

<script setup lang="ts">
import { Transform, Vector, Angle } from '../Transform';
import { objectProps, becomeObject } from '../ObjectComposable';
import { ref, onMounted, useTemplateRef } from 'vue';

import ModelRoom from './ModelRoom.vue';
import ModelFocusScreen from './ModelFocusScreen.vue';
import PortfolioCarousel from '@/components/portfolioProjects/PortfolioCarousel.vue';
import ModelSign from './ModelSign.vue';

const billboard = useTemplateRef('billboard');
const focusSign = useTemplateRef('focusSign');
const room = useTemplateRef('room');

const isFocused = ref(true);
const roomWidth = ref(1000);
const roomWidthPadding = 1000;
const roomHeight = ref(1000);
const roomHeightPadding = 500;
const roomLength = ref(3000);

const props = defineProps({
	...objectProps,
});
const { objectStyle, objectExposables } = becomeObject(props, { tick: tick });
defineExpose({ ...objectExposables, focus, isFocused });

function tick() {
	if (billboard.value) {
		isFocused.value = billboard.value.isFocused();
	}
}

onMounted(() => {
	window.addEventListener('resize', updateResize);

	updateResize();
});

function updateResize() {
	if (billboard.value && focusSign.value && room.value) {
		// Move the billboard
		billboard.value.transform.setPositionZ(window.innerHeight / 2 + 100);
		billboard.value.transform.setPositionY(-roomLength.value / 2 + 10);
		// Move the sign
		focusSign.value.transform.setPositionX(window.innerWidth / 2 - 150);
		focusSign.value.transform.setPositionY(-roomLength.value / 2 + 100);
		// Refocus the sign so we don't get a shifted view
		if (billboard.value.isFocused()) {
			billboard.value.focus(true);
		}
		// Resize the room
		const viewPort = objectExposables.world.getViewportElement();
		if (!viewPort) {
			return;
		}
		roomWidth.value = viewPort.clientWidth + roomWidthPadding;
		roomHeight.value = viewPort.clientHeight + roomHeightPadding;
		// width.value = viewPort.clientWidth + 10; // Add padding to give some leeway with how the plane is placed
		// height.value = viewPort.clientHeight + 10;
		return true;
	}
	return false;
}

function focus(instant: boolean = false) {
	if (!billboard.value) {
		return;
	}
	billboard.value.focus(instant);
}

function moveBack() {
	if (!billboard.value) {
		return;
	}
	billboard.value.unfocus(new Vector(0, 800, 0));
	setTimeout(() => {
		if (objectExposables.world) {
			objectExposables.world.cineMoveCamera(2, undefined, new Angle(90, 0, 0));
		}
	}, 2000);
}
</script>

<style scoped>
@import '../ObjectComposable.css';
.defaultColor {
	background-color: rgb(150, 150, 150);
}
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
