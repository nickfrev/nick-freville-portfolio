<template>
	<HTML3D ref="world">
		<debugCube ref="debugCubeRef"> </debugCube>

		<Object3D ref="testBox1" :transform="new Transform(0, 0, 1500, 0, 0, 0)">
			<Div3D
				:transform="new Transform(250, 0, 0, 0, 0, 90)"
				style="background-color: rgb(200, 50, 50)"
			>
				<div style="width: 100%; height: 100%; text-align: center; line-height: 250px">RIGHT</div>
			</Div3D>
			<Div3D
				:transform="new Transform(-250, 0, 0, 0, 0, -90)"
				style="background-color: rgb(200, 200, 50)"
			>
				<div style="width: 100%; height: 100%; text-align: center; line-height: 250px">LEFT</div>
			</Div3D>
			<Div3D
				:transform="new Transform(0, 250, 0, -90, 0, 180)"
				style="background-color: rgb(200, 50, 200)"
			>
				<div style="width: 100%; height: 100%; text-align: center; line-height: 250px">FRONT</div>
			</Div3D>
			<Div3D
				:transform="new Transform(0, -250, 0, 90, 0, 0)"
				style="background-color: rgb(50, 200, 50)"
			>
				<iframe
					width="500"
					height="500"
					src="https://www.youtube.com/embed/5dtmTkT7t_w?si=QwgfBvx-4YjzmQeK"
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
			</Div3D>
			<Div3D
				:transform="new Transform(0, 0, 250, 0, 0, 0)"
				style="background-color: rgb(50, 200, 255)"
			>
				<div style="width: 100%; height: 100%; text-align: center; line-height: 250px">TOP</div>
			</Div3D>

			<Div3D
				:transform="new Transform(0, 0, -250, 180, 0, 0)"
				style="background-color: rgb(50, 200, 255)"
			>
				<div style="width: 100%; height: 100%; text-align: center; line-height: 250px">BOTTOM</div>
			</Div3D>
		</Object3D>
	</HTML3D>
</template>

<script setup lang="ts">
import HTML3D from './components/HTML3D/HTML3D.vue';
import Object3D from './components/HTML3D/Object3D.vue';
import Div3D from './components/HTML3D/Div3D.vue';
import debugCube from './components/HTML3D/objects/debugCube.vue';
import { Transform } from './components/HTML3D/Transform';
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

			world.value.cameraController.setCameraPos(0, 0, 800);
		}
	}
}
requestAnimationFrame(draw);
</script>

<style scoped></style>
