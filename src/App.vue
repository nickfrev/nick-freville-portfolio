<template>
	<HTML3D ref="world">
		<Object3D ref="testBox1">
			<Div3D
				:transform="new Transform(250, 0, 0, 0, 0, 90)"
				style="background-color: rgb(200, 50, 50)"
			></Div3D>
			<Div3D
				:transform="new Transform(-250, 0, 0, 0, 0, -90)"
				style="background-color: rgb(200, 200, 50)"
			></Div3D>
			<Div3D
				:transform="new Transform(0, 250, 0, 90, 0, 0)"
				style="background-color: rgb(200, 50, 200)"
			></Div3D>
			<Div3D
				:transform="new Transform(0, -250, 0, -90, 0, 0)"
				style="background-color: rgb(50, 200, 50)"
			></Div3D>
			<Div3D
				:transform="new Transform(0, 0, 250, 0, 0, 0)"
				style="background-color: rgb(50, 200, 200)"
			></Div3D>
		</Object3D>

		<Object3D ref="testBox2">
			<Div3D
				:transform="new Transform(125, 0, 0, 0, 0, 90)"
				:width="250"
				:height="250"
				style="background-color: rgb(150, 50, 50)"
			></Div3D>
			<Div3D
				:transform="new Transform(-125, 0, 0, 0, 0, -90)"
				:width="250"
				:height="250"
				style="background-color: rgb(150, 150, 50)"
			></Div3D>
			<Div3D
				:transform="new Transform(0, 125, 0, 90, 0, 0)"
				:width="250"
				:height="250"
				style="background-color: rgb(150, 50, 150)"
			></Div3D>
			<Div3D
				:transform="new Transform(0, -125, 0, -90, 0, 0)"
				:width="250"
				:height="250"
				style="background-color: rgb(50, 150, 50)"
			></Div3D>
			<Div3D
				:transform="new Transform(0, 0, 125, 0, 0, 0)"
				:width="250"
				:height="250"
				style="background-color: rgb(50, 150, 150)"
			></Div3D>
			<Div3D
				:transform="new Transform(0, 0, -125, 180, 0, 0)"
				:width="250"
				:height="250"
				style="background-color: rgb(50, 50, 150)"
			>
				<button>Hello</button>
			</Div3D>
		</Object3D>

		<Object3D>
			<Div3D
				:transform="new Transform(125, 0, 0, 0, 0, 90)"
				:width="250"
				:height="250"
				style="background-color: rgb(150, 50, 50)"
			></Div3D>
			<Div3D
				:transform="new Transform(-125, 0, 0, 0, 0, -90)"
				:width="250"
				:height="250"
				style="background-color: rgb(150, 150, 50)"
			></Div3D>
			<Div3D
				:transform="new Transform(0, 125, 0, 90, 0, 0)"
				:width="250"
				:height="250"
				style="background-color: rgb(150, 50, 150)"
			></Div3D>
			<Div3D
				:transform="new Transform(0, -125, 0, -90, 0, 0)"
				:width="250"
				:height="250"
				style="background-color: rgb(50, 150, 50)"
			></Div3D>
			<Div3D
				:transform="new Transform(0, 0, 125, 0, 0, 0)"
				:width="250"
				:height="250"
				style="background-color: rgb(50, 150, 150)"
			></Div3D>
			<Div3D
				:transform="new Transform(0, 0, -125, 180, 0, 0)"
				:width="250"
				:height="250"
				style="background-color: rgb(50, 50, 150)"
			>
			</Div3D>
		</Object3D>

		<Object3D ref="player">
			<Div3D
				:transform="new Transform(125, 0, 0, 0, 0, 90)"
				:width="250"
				:height="250"
				style="background-color: rgb(150, 50, 50)"
			></Div3D>
			<Div3D
				:transform="new Transform(-125, 0, 0, 0, 0, -90)"
				:width="250"
				:height="250"
				style="background-color: rgb(150, 150, 50)"
			></Div3D>
			<Div3D
				:transform="new Transform(0, 125, 0, 90, 0, 0)"
				:width="250"
				:height="250"
				style="background-color: rgb(150, 50, 150)"
			></Div3D>
			<Div3D
				:transform="new Transform(0, -125, 0, -90, 0, 0)"
				:width="250"
				:height="250"
				style="background-color: rgb(50, 150, 50)"
			>
				hello world
				<button>Hi Bean</button>
				<input />
			</Div3D>
			<Div3D
				:transform="new Transform(0, 0, 125, 0, 0, 0)"
				:width="250"
				:height="250"
				style="background-color: rgb(50, 150, 150)"
			></Div3D>
			<Div3D
				:transform="new Transform(0, 0, -125, 180, 0, 0)"
				:width="250"
				:height="250"
				style="background-color: rgb(50, 50, 150)"
			>
			</Div3D>
		</Object3D>
	</HTML3D>
</template>

<script setup lang="ts">
import HTML3D from './components/HTML3D/HTML3D.vue';
import Object3D from './components/HTML3D/Object3D.vue';
import Div3D from './components/HTML3D/Div3D.vue';
import { Transform } from './components/HTML3D/Transform';
import { useTemplateRef } from 'vue';

const boxes = [useTemplateRef('testBox1'), useTemplateRef('testBox2')];
const world = useTemplateRef('world');
const player = useTemplateRef('player');
let once = true;

function draw() {
	requestAnimationFrame(draw);

	const now = Date.now() / 1000;
	for (const box of boxes) {
		const pos = box.value?.transform.position;
		const ang = box.value?.transform.angle;

		if (!pos || !ang) continue;

		// pos.y = Math.sin(now) * 300;
		// pos.x = Math.cos(now * 10) * 300;
		pos.z = Math.abs(Math.cos(now) * 1500);
		ang.pitch = (now * 20) % 360;
		ang.roll = (now * 100) % 360;
		box.value.update();
	}

	if (player.value && world.value && once) {
		once = false;

		player.value.transform.position.x = -2000;
		player.value.transform.position.y = -2000;
		player.value.update();

		world.value.setCameraPos(-2000, -2000, 150);
		world.value.setCameraAng(90);
		// world.value.camera?.transform
		// world.value.camera.value.transform.position.x = -400;
		// world.value.cameraTransform.position.y = -400;
		// world.value.cameraTransform.position.z = 50;
		// world.value.cameraTransform.angle.pitch = 90;
		// world.value.cameraTransform.angle.yaw = 90;
		// world.value.cameraTransform.angle.yaw = 90;
		// world.value.cameraTransform.angle.yaw = (now * 10) % 360;
		// world.value.cameraTransform.position.z = -200;
		world.value.tick();
	}

	if (world.value) {
		world.value.tick();
	}
}
requestAnimationFrame(draw);
</script>

<style scoped>
.contentScale {
	line-height: 0.1rem;
	font-size: 0.1rem;
	color: red;
}
</style>
