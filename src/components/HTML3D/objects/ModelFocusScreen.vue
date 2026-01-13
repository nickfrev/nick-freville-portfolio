<template>
	<div class="object" :style="objectStyle">
		<ModelCube
			ref="billboard"
			:width="width + 50"
			:height="height + 50"
			:length="8"
			:transform="new Transform(0, -2, 0)"
			style="background-color: black; border: 2px solid white"
		>
		</ModelCube>
		<ModelCube
			ref="billboard"
			:width="width"
			:height="height"
			:length="10"
			style="background-color: rgb(20, 20, 20); border: 2px solid white"
		>
			<template v-slot:front>
				<div class="slotWrapper">
					<slot></slot>
				</div>
			</template>
		</ModelCube>
	</div>
</template>

<script setup lang="ts">
import { onMounted, ref, useTemplateRef } from 'vue';
import { objectProps, becomeObject } from '../ObjectComposable';
import { Transform, Angle, Vector } from '../Transform';
import ModelCube from './ModelCube.vue';

const billboard = useTemplateRef('billboard');

const width = ref(100);
const height = ref(100);

const props = defineProps({
	...objectProps,
	trackViewportDimensions: {
		type: Boolean,
		default: false,
	},
});
const { objectStyle, objectExposables } = becomeObject(props);
defineExpose({ ...objectExposables, focus, unfocus });

onMounted(() => {
	window.addEventListener('resize', updateDimensions);

	updateDimensions();
});

function updateDimensions() {
	const viewPort = objectExposables.world.getViewportElement();
	if (!viewPort) {
		return;
	}

	width.value = viewPort.clientWidth + 10; // Add padding to give some leeway with how the plane is placed
	height.value = viewPort.clientHeight + 10;
}

function focus() {
	if (!billboard.value) {
		return;
	}

	const cameraController = objectExposables.world.cameraController;
	const newPosition = billboard.value.localToWorldTransform(
		new Transform(0, cameraController.defaultCameraPerspective, 0, 90, 180, 0),
	);
	const position = newPosition.getPosition();
	cameraController.setCameraPerspective(null);
	objectExposables.world.cineMoveCamera(2, position, new Angle(90, 180, 0));
}

function unfocus(positionOffset?: Vector, angleOffset?: Angle) {
	if (!billboard.value) {
		return;
	}
	positionOffset = positionOffset ?? new Vector(0, 0, 0);
	angleOffset = angleOffset ?? new Angle(0, 0, 0);

	const cameraController = objectExposables.world.cameraController;
	const newPosition = billboard.value.localToWorldTransform(
		new Transform(
			0 + positionOffset.x,
			cameraController.defaultCameraPerspective + positionOffset.y,
			positionOffset.z,
			90,
			180,
			0,
		),
	);
	const position = newPosition.getPosition();
	cameraController.setCameraPerspective(cameraController.defaultCameraPerspective);
	objectExposables.world.cineMoveCamera(
		2,
		position,
		new Angle(90 + angleOffset.pitch, 180 + angleOffset.yaw, 0),
	);
}
</script>

<style scoped>
@import '../ObjectComposable.css';
.defaultColor {
	background-color: white;
}

.slotWrapper {
	padding: 10px;
}
</style>
