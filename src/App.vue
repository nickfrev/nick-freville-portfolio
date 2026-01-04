<template>
	<HTML3D>
		<Object3D ref="testBox1">
			<Div3D :transform="new Transform(50, 0, 0, 0, 0, 90)" style="background-color: rgb(255, 0, 0)"></Div3D>
			<Div3D :transform="new Transform(-50, 0, 0, 0, 0, -90)" style="background-color: rgb(255, 255, 0)"></Div3D>
			<Div3D :transform="new Transform(0, 50, 0, 90, 0, 0)" style="background-color: rgb(255, 0, 255)"></Div3D>
			<Div3D :transform="new Transform(0, -50, 0, -90, 0, 0)" style="background-color: rgb(0, 255, 0)"></Div3D>
			<Div3D :transform="new Transform(0, 0, 50, 0, 0, 0)" style="background-color: rgb(0, 255, 255)"></Div3D>
		</Object3D>

		<Object3D ref="testBox2">
			<Div3D :transform="new Transform(25, 0, 0, 0, 0, 90)" :width="50" :height="50"
				style="background-color: rgb(150, 0, 0)"></Div3D>
			<Div3D :transform="new Transform(-25, 0, 0, 0, 0, -90)" :width="50" :height="50"
				style="background-color: rgb(150, 150, 0)"></Div3D>
			<Div3D :transform="new Transform(0, 25, 0, 90, 0, 0)" :width="50" :height="50"
				style="background-color: rgb(150, 0, 150)"></Div3D>
			<Div3D :transform="new Transform(0, -25, 0, -90, 0, 0)" :width="50" :height="50"
				style="background-color: rgb(0, 150, 0)"></Div3D>
			<Div3D :transform="new Transform(0, 0, 25, 0, 0, 0)" :width="50" :height="50"
				style="background-color: rgb(0, 150, 150)"></Div3D>
			<Div3D :transform="new Transform(0, 0, -25, 180, 0, 0)" :width="50" :height="50"
				style="background-color: rgb(0, 0, 150)">
				<button>Hello</button>
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

function draw() {
	requestAnimationFrame(draw);

	for (const box of boxes) {
		const pos = box.value?.transform.position;
		const ang = box.value?.transform.angle;

		if (!pos || !ang) continue;

		const now = Date.now() / 5000;
		pos.y = Math.sin(now) * 150;
		pos.x = Math.cos(now) * 150;
		// pos.x = Math.sin(now * 3) * 1500;
		ang.pitch = (now * 20) % 360;
		ang.roll = (now * 100) % 360;
		box.value.update();
	}
}
requestAnimationFrame(draw);
</script>

<style scoped></style>
