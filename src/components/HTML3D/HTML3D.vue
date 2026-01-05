<template>
	<div
		class="cameraSpace"
		@mousedown="onMouseDown"
		@mouseup="onMouseUp"
		@mousemove="onMouseMove"
		@contextmenu="onContextMenu"
		@mouseleave="onMouseLeave"
	>
		<Camera3D ref="cameraScene">
			<slot></slot>
		</Camera3D>
	</div>
</template>

<script setup lang="ts">
import { Position, Transform } from './Transform';
import Camera3D from './Camera3D.vue';
import { useTemplateRef } from 'vue';

const camera = useTemplateRef('cameraScene');

/////
// Set the Camera's position and angle
/////
const transformBuffer = new Transform();
let transformBufferChange = false;
function setCameraPos(x: null | number = null, y: null | number = null, z: null | number = null) {
	transformBufferChange = true;
	if (x) {
		transformBuffer.position.x = x;
	}
	if (y) {
		transformBuffer.position.y = y;
	}
	if (z) {
		transformBuffer.position.z = z;
	}
}

function addToCameraPos(x: null | number = null, y: null | number = null, z: null | number = null) {
	transformBufferChange = true;
	if (x) {
		transformBuffer.position.x += x;
	}
	if (y) {
		transformBuffer.position.y += y;
	}
	if (z) {
		transformBuffer.position.z += z;
	}
}

function setCameraAng(
	pitch: null | number = null,
	yaw: null | number = null,
	roll: null | number = null,
) {
	transformBufferChange = true;
	if (pitch) {
		transformBuffer.angle.pitch = pitch;
	}
	if (yaw) {
		transformBuffer.angle.yaw = yaw;
	}
	if (roll) {
		transformBuffer.angle.roll = roll;
	}
}

function addToCameraAng(
	pitch: null | number = null,
	yaw: null | number = null,
	roll: null | number = null,
) {
	transformBufferChange = true;
	if (pitch) {
		transformBuffer.angle.pitch += pitch;
	}
	if (yaw) {
		transformBuffer.angle.yaw += yaw;
	}
	if (roll) {
		transformBuffer.angle.roll += roll;
	}
}

function checkForCameraTransformChange() {
	if (!camera.value) {
		return;
	}

	if (transformBufferChange) {
		transformBufferChange = false;
		camera.value.transform.position.x = transformBuffer.position.x;
		camera.value.transform.position.y = transformBuffer.position.y;
		camera.value.transform.position.z = transformBuffer.position.z;

		camera.value.transform.angle.pitch = transformBuffer.angle.pitch;
		camera.value.transform.angle.yaw = transformBuffer.angle.yaw;
		camera.value.transform.angle.roll = transformBuffer.angle.roll;
	}
}
/////
// Main logic loop for updating
/////
function tick() {
	if (!camera.value) {
		return;
	}

	moveTick();
	checkForCameraTransformChange();

	camera.value.update();
}

/////
// Mouse Controls for looking around
/////
let mouseDown = false;
let lastPos = { x: 0, y: 0 };
function onMouseDown(event: MouseEvent) {
	if (event.button == 2) {
		mouseDown = true;
		lastPos = { x: event.clientX, y: event.clientY };
		event.stopPropagation();
		event.preventDefault();
	}
}

function onMouseUp(event: MouseEvent) {
	if (event.button == 2) {
		mouseDown = false;
		event.stopPropagation();
		event.preventDefault();
	}
}

function onMouseLeave() {
	mouseDown = false;
}

function onMouseMove(event: MouseEvent) {
	if (mouseDown) {
		const diff = { x: event.clientX - lastPos.x, y: event.clientY - lastPos.y };
		lastPos = { x: event.clientX, y: event.clientY };
		addToCameraAng(-diff.y * 0.25, -diff.x * 0.25);

		event.stopPropagation();
		event.preventDefault();
	}
}

function onContextMenu(event: MouseEvent) {
	event.stopPropagation();
	event.preventDefault();
}

/////
// Keyboard Controls
/////
document.addEventListener('keydown', onKeyDown);
document.addEventListener('keyup', onKeyUp);

const moveVector = new Position();
let moveForward = false;
let moveBackward = false;
let moveLeft = false;
let moveRight = false;

function moveTick() {
	const speed = 10;
	moveVector.y = moveForward ? speed : moveBackward ? -speed : 0;
	moveVector.x = moveRight ? speed : moveLeft ? -speed : 0;
	// Get the movement vectors
	const lookNormal = transformBuffer.get2DLookNormal();
	// Add that to the current position
	if (moveVector.y || moveVector.x) {
		// Project the move vector along the look normal
		addToCameraPos(
			lookNormal.x * moveVector.y + lookNormal.y * moveVector.x,
			lookNormal.y * moveVector.y - lookNormal.x * moveVector.x,
		);
	}
}

function onKeyDown(event: KeyboardEvent) {
	if (mouseDown) {
		if (event.key == 'w') {
			moveForward = true;
		} else if (event.key == 's') {
			moveBackward = true;
		} else if (event.key == 'a') {
			moveLeft = true;
		} else if (event.key == 'd') {
			moveRight = true;
		}
	}
}

function onKeyUp(event: KeyboardEvent) {
	if (event.key == 'w') {
		moveForward = false;
	} else if (event.key == 's') {
		moveBackward = false;
	} else if (event.key == 'a') {
		moveLeft = false;
	} else if (event.key == 'd') {
		moveRight = false;
	}
}

defineExpose({ setCameraPos, setCameraAng, tick });
</script>

<style scoped>
.cameraSpace {
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
