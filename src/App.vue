<template>
	<HTML3D ref="world">
		<ModelWelcomeRoom ref="welcomeRoom"></ModelWelcomeRoom>
		<Object3D v-if="showWorld">
			<DebugCube :transform="new Transform(850, 1100, 0, 0, 40, 0)"> </DebugCube>

			<ModelSign
				:transform="new Transform(-400, 1000, 0, 0, 140, 0)"
				style="
					background-color: rgb(158, 76, 30);
					border: 2px solid rgb(128, 46, 0);
					color: rgb(233, 206, 154);
				"
			>
				<div class="signText" style="padding: 10px">
					<div class="signTitle">Did you know?</div>
					<p>You can move the camera by right clicking and dragging.</p>
					<div>WASD to move around.</div>
				</div>
			</ModelSign>

			<ModelSign
				:transform="new Transform(-300, 2000, 0, 0, 140, 0)"
				style="
					background-color: rgb(158, 76, 30);
					border: 2px solid rgb(128, 46, 0);
					color: rgb(233, 206, 154);
				"
			>
				<div class="signText" style="padding: 10px">
					<div class="signTitle">More to come!</div>
					<p>Currently this is just a void, but in the future much is planned for this space.</p>
				</div>
			</ModelSign>
		</Object3D>
	</HTML3D>
</template>

<script setup lang="ts">
import HTML3D from './components/HTML3D/HTML3D.vue';
import Object3D from './components/HTML3D/Object3D.vue';
import DebugCube from './components/HTML3D/objects/DebugCube.vue';
import ModelSign from './components/HTML3D/objects/ModelSign.vue';
import { useTemplateRef, ref } from 'vue';
import { Transform } from './components/HTML3D/Transform';
import ModelWelcomeRoom from './components/HTML3D/objects/ModelWelcomeRoom.vue';

const world = useTemplateRef('world');
const welcomeRoom = useTemplateRef('welcomeRoom');
const showWorld = ref(false);
let timeout: ReturnType<typeof setTimeout> | undefined = undefined;

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

		if (
			world.value.cameraController.getCameraPerspective() !== null &&
			timeout === undefined &&
			!showWorld.value
		) {
			clearTimeout(timeout);
			timeout = setTimeout(() => {
				timeout = undefined;
				showWorld.value = true;
			}, 300);
		} else if (world.value.cameraController.getCameraPerspective() === null && showWorld.value) {
			clearTimeout(timeout);
			showWorld.value = false;
		}
	}
}
requestAnimationFrame(draw);
</script>

<style>
@import './theme.css';
.sign {
	background-color: rgb(158, 76, 30);
	border: 2px solid rgb(128, 46, 0);
	color: rgb(233, 206, 154);
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
</style>
