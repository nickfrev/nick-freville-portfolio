<template>
	<div class="object" :style="objectStyle">
		<ModelCube ref="movementTest" :transform="new Transform(0, 0, 800, 0, 0, 0)">
			<template v-slot:right>
				<div style="width: 100%; height: 100%; text-align: center; line-height: 250px">RIGHT</div>
			</template>
			<template v-slot:left>
				<div style="width: 100%; height: 100%; text-align: center; line-height: 250px">LEFT</div>
			</template>
			<template v-slot:front>
				<div style="width: 100%; height: 100%; text-align: center; line-height: 250px">FRONT</div>
			</template>
			<template v-slot:back>
				<div style="width: 100%; height: 100%; text-align: center; line-height: 250px">BACK</div>
			</template>
			<template v-slot:top>
				<div style="width: 100%; height: 100%; text-align: center; line-height: 250px">TOP</div>
			</template>
			<template v-slot:bottom>
				<div style="width: 100%; height: 100%; text-align: center; line-height: 250px">BOTTOM</div>
			</template>
		</ModelCube>

		<Div3D
			ref="forward"
			:transform="new Transform(0, 0, 0, 90, 0, 0)"
			:show-backface="true"
			:width="50"
			:height="50"
			style="background-color: rgba(255, 50, 50, 0.25)"
		></Div3D>
		<Div3D
			ref="right"
			:transform="new Transform(0, 0, 0, 90, 0, 0)"
			:show-backface="true"
			:width="50"
			:height="50"
			style="background-color: rgba(50, 255, 50, 0.25)"
		></Div3D>
		<Div3D
			ref="up"
			:transform="new Transform(0, 0, 0, 90, 0, 0)"
			:show-backface="true"
			:width="50"
			:height="50"
			style="background-color: rgba(50, 50, 255, 0.25)"
		></Div3D>

		<ModelCube :transform="new Transform(0, 0, 250)" :width="500" :height="250" :length="500">
		</ModelCube>
		<ModelCube
			:transform="new Transform(0, -200, 325, -45)"
			:width="300"
			:height="250"
			:length="150"
		>
			<template v-slot:back>
				<div class="cubeUI">
					This test shows how we can get positions relative to objects in 3D space by using their
					DOMMatrix. The colored planes show the values of .forward(), .right(), and .up() of the
					Transform class related to the rotating cube.

					<br />The below button shows tracking with the localToWorld method.
					<button @click="toggleTrackPosition">
						{{ trackPosition ? 'Stop Tracking' : 'Start Tracking' }}
					</button>
				</div>
			</template>
		</ModelCube>
		<ModelCube
			ref="testCube"
			:width="100"
			:height="100"
			:length="100"
			:transform="new Transform(0, 0, 250)"
		></ModelCube>
	</div>
</template>

<script setup lang="ts">
import Div3D from '../Div3D.vue';
import ModelCube from './ModelCube.vue';
import { Transform } from '../Transform';
import { useTemplateRef } from 'vue';
import { objectProps, becomeObject } from '../ObjectComposable';
import { ref } from 'vue';

const trackPosition = ref(false);

const props = defineProps(objectProps);
const { objectStyle, objectExposables } = becomeObject(props, { tick: tick });

const forward = useTemplateRef('forward');
const right = useTemplateRef('right');
const up = useTemplateRef('up');
const movementTest = useTemplateRef('movementTest');
const testCube = useTemplateRef('testCube');
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
	const height = 800;
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

	// Update the to local cube
	if (trackPosition.value) {
		testLocalToWorld();
	}
}

function toggleTrackPosition() {
	trackPosition.value = !trackPosition.value;
}

function testLocalToWorld() {
	const position = movementTest.value?.localToWorldTransform(new Transform(175, 175, 175));
	if (position) {
		testCube.value?.transform.setMatrix(position?.getMatrix());
	}
}

defineExpose({ ...objectExposables, movementTest });
</script>

<style scoped>
@import '../ObjectComposable.css';

.cubeUI {
	width: 100%;
	height: 100%;
	padding: 20px;
}
</style>
