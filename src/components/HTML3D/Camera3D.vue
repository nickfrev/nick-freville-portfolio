<template>
	<div class="camera" :style="objectStyle">
		<Object3D ref="worldScale">
			<slot></slot>
		</Object3D>
	</div>
</template>

<script setup lang="ts">
import Object3D from './Object3D.vue';
import { objectProps, becomeObject } from './ObjectComposable';
import { useTemplateRef } from 'vue';
const props = defineProps(objectProps);
const { objectStyle, objectExposables } = becomeObject(props, true);

// Allows for scaling the world
const worldScale = useTemplateRef('worldScale');
function setScale(value: number) {
	if (worldScale.value) {
		worldScale.value.transform.scale = value;
		worldScale.value.update();
	}
}

defineExpose({ ...objectExposables, setScale });
</script>

<style scoped>
.camera {
	display: block;

	position: absolute;
	width: 0px;
	height: 0px;

	top: 50%;
	right: 50%;

	backface-visibility: visible;

	background-color: black;
	visibility: hidden;
	transform-origin: center;
	transform-style: preserve-3d;
	transform-box: content-box;
}
</style>
