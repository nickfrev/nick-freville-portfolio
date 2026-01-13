<template>
	<HTML3D ref="world">
		<DebugCube> </DebugCube>
		<ModelFocusScreen ref="billboard" :transform="new Transform(800, 800, 800)">
			<button @click="focusDiv">click</button>
			<button @click="moveBack">Move back</button>
			Hello World
		</ModelFocusScreen>
	</HTML3D>
</template>

<script setup lang="ts">
import HTML3D from './components/HTML3D/HTML3D.vue';
import DebugCube from './components/HTML3D/objects/DebugCube.vue';
import ModelFocusScreen from './components/HTML3D/objects/ModelFocusScreen.vue';
import { useTemplateRef } from 'vue';
import { Transform, Vector } from './components/HTML3D/Transform';

const world = useTemplateRef('world');
const billboard = useTemplateRef('billboard');

let once = true;

function draw() {
	requestAnimationFrame(draw);

	if (world.value) {
		world.value.render();
		world.value.tick();

		if (once) {
			once = false;

			world.value.cameraController.setCameraPos(0, -800, 800);
			world.value.cameraController.setCameraAng(70, 0, 0);
		}
	}
}
requestAnimationFrame(draw);

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
}
</script>

<style scoped></style>
