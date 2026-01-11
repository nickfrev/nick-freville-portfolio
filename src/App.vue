<template>
	<HTML3D ref="world">
		<DebugCube> </DebugCube>
	</HTML3D>
</template>

<script setup lang="ts">
import HTML3D from './components/HTML3D/HTML3D.vue';
// import Div3D from './components/HTML3D/Div3D.vue';
import DebugCube from './components/HTML3D/objects/DebugCube.vue';
// import { Transform } from './components/HTML3D/Transform';
import { useTemplateRef } from 'vue';

const world = useTemplateRef('world');

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
</script>

<style scoped></style>
