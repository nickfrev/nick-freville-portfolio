<template>
	<HTML3D ref="world">
		<ModelWelcomeRoom ref="welcomeRoom"></ModelWelcomeRoom>
		<DebugCube :transform="new Transform(1400, 1600, 0, 0, 90, 0)"> </DebugCube>

		<ModelSign
			:transform="new Transform(0, 2000, 100, 0, -110, 0)"
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
import ModelSign from './components/HTML3D/objects/ModelSign.vue';
import { useTemplateRef } from 'vue';
import { Transform } from './components/HTML3D/Transform';
import ModelWelcomeRoom from './components/HTML3D/objects/ModelWelcomeRoom.vue';

const world = useTemplateRef('world');
const welcomeRoom = useTemplateRef('welcomeRoom');

let once = true;

function draw() {
	requestAnimationFrame(draw);

	if (world.value) {
		world.value.render();
		world.value.tick();

		if (once && welcomeRoom.value) {
			once = false;
			welcomeRoom.value.focus(true);
		}
	}
}
requestAnimationFrame(draw);
</script>

<style>
@import './theme.css';
</style>
