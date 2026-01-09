<template>
	<div class="object" :style="objectStyle">
		<Object3D ref="movementTest" :transform="new Transform(0, 0, 0, 0, 0, 0)">
			<Div3D
				:transform="new Transform(125, 0, 0, 0, 0, 90)"
				:width="250"
				:height="250"
				style="background-color: rgb(150, 50, 50)"
			>
				<div style="width: 100%; height: 100%; text-align: center; line-height: 250px">RIGHT</div>
			</Div3D>
			<Div3D
				:transform="new Transform(-125, 0, 0, 0, 0, -90)"
				:width="250"
				:height="250"
				style="background-color: rgb(150, 150, 50)"
			>
				<div style="width: 100%; height: 100%; text-align: center; line-height: 250px">LEFT</div>
			</Div3D>
			<Div3D
				:transform="new Transform(0, 125, 0, -90, 0, 0)"
				:width="250"
				:height="250"
				style="background-color: rgb(150, 50, 150)"
			>
				<div style="width: 100%; height: 100%; text-align: center; line-height: 250px">FRONT</div>
			</Div3D>
			<Div3D
				:transform="new Transform(0, -125, 0, 90, 0, 0)"
				:width="250"
				:height="250"
				style="background-color: rgb(50, 150, 50)"
			>
				<div style="width: 100%; height: 100%; text-align: center; line-height: 250px">BACK</div>
			</Div3D>
			<Div3D
				:transform="new Transform(0, 0, 125, 0, 0, 0)"
				:width="250"
				:height="250"
				style="background-color: rgb(50, 150, 150)"
			>
				<div style="width: 100%; height: 100%; text-align: center; line-height: 250px">TOP</div>
			</Div3D>
			<Div3D
				:transform="new Transform(0, 0, -125, 180, 0, 0)"
				:width="250"
				:height="250"
				style="background-color: rgb(50, 50, 150)"
			>
				<div style="width: 100%; height: 100%; text-align: center; line-height: 250px">BOTTOM</div>
			</Div3D>
		</Object3D>

		<Div3D
			ref="forward"
			:transform="new Transform(0, 0, 0, 0, 0, 0)"
			:width="50"
			:height="50"
			style="background-color: rgb(255, 50, 50)"
		></Div3D>
		<Div3D
			ref="right"
			:transform="new Transform(0, 0, 0, 0, 0, 0)"
			:width="50"
			:height="50"
			style="background-color: rgb(50, 255, 50)"
		></Div3D>
		<Div3D
			ref="up"
			:transform="new Transform(0, 0, 0, 0, 0, 0)"
			:width="50"
			:height="50"
			style="background-color: rgb(50, 50, 255)"
		></Div3D>
		<Div3D
			ref="origin"
			:transform="new Transform(0, 0, 0, 0, 0, 0)"
			:width="50"
			:height="50"
			style="background-color: rgb(255, 255, 255)"
		></Div3D>
	</div>
</template>

<script setup lang="ts">
import Object3D from '../Object3D.vue';
import Div3D from '../Div3D.vue';
import { Transform } from '../Transform';
import { useTemplateRef } from 'vue';
import { objectProps, becomeObject } from '../ObjectComposable';

const props = defineProps(objectProps);
const { objectStyle, objectExposables } = becomeObject(props, { tick: tick });

const forward = useTemplateRef('forward');
const right = useTemplateRef('right');
const up = useTemplateRef('up');
const origin = useTemplateRef('origin');
const movementTest = useTemplateRef('movementTest');
const radius = 300;

function tick() {
	if (!movementTest.value) {
		return;
	}

	// Rotate Cube
	const now = Date.now() / 8000;
	const trans = movementTest.value.transform;
	const magnitude = 180;
	trans.setAngle(
		Math.sin(now) * magnitude,
		Math.sin(now * 2) * magnitude,
		Math.sin(now * 3) * magnitude,
	);

	// Update axis followers
	const camTran = movementTest.value.transform;
	const height = 0;
	if (origin.value) {
		const forTran = origin.value.transform;
		forTran.setPosition(0, 0, height);
	}
	if (forward.value) {
		const forTran = forward.value.transform;
		const forwardVec = camTran.getForward();
		forTran.setPosition(
			forwardVec.x * radius,
			forwardVec.y * radius,
			forwardVec.z * radius + height,
		);
	}
	if (right.value) {
		const forTran = right.value.transform;
		const rightVec = camTran.getRight();
		forTran.setPosition(rightVec.x * radius, rightVec.y * radius, rightVec.z * radius + height);
	}
	if (up.value) {
		const forTran = up.value.transform;
		const upVec = camTran.getUp();
		forTran.setPosition(upVec.x * radius, upVec.y * radius, upVec.z * radius + height);
	}
}

defineExpose({ ...objectExposables });
</script>

<style scoped>
@import '../ObjectComposable.css';
</style>
