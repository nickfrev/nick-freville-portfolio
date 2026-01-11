<template>
	<div
		class="viewPort"
		@mousedown="cameraController.onMouseDown"
		@mouseup="cameraController.onMouseUp"
		@mousemove="cameraController.onMouseMove"
		@contextmenu="cameraController.onContextMenu"
		@mouseleave="cameraController.onMouseLeave"
	>
		<Camera3D ref="cameraScene">
			<slot></slot>
		</Camera3D>
	</div>
	<div class="debug"><slot name="debug"></slot></div>
</template>

<script setup lang="ts">
import CameraController from './CameraController.ts';
import Camera3D from './Camera3D.vue';
import { useTemplateRef } from 'vue';

import type { SceneObject } from './ObjectComposable.ts';

const camera = useTemplateRef('cameraScene');
const cameraController = new CameraController();

/////
// Main logic loop for updating
/////
const sceneObjects = new Map<number, SceneObject>();
let sceneObjectsCount = 0;
function registerNewObject(object: SceneObject) {
	const newId = sceneObjectsCount;
	sceneObjectsCount++;
	sceneObjects.set(newId, object);
}

function render() {
	if (camera.value) {
		cameraController.render(camera.value);
	}

	for (const [, value] of sceneObjects) {
		value.render();
	}
}

function tick() {
	cameraController.tick();

	for (const [, value] of sceneObjects) {
		value.tick();
	}
}

defineExpose({ cameraController, render, tick, registerNewObject });
</script>

<style scoped>
.debug {
	position: absolute;
	top: 0px;
	right: 0px;
	color: white;
	background-color: rgba(0, 0, 0, 0.25);
}
.viewPort {
	position: absolute;
	top: 0px;
	left: 0px;
	bottom: 0px;
	right: 0px;
	border: solid 1px black;

	perspective-origin: 50% 50%;
	transform-style: preserve-3d;
	background-color: rgb(23, 23, 23);
	transform-origin: center center;
	overflow: hidden;
}
</style>
