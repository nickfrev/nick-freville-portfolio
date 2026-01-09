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
			<slot ref="slotContent"></slot>
		</Camera3D>
	</div>
	<div class="debug"><slot name="debug"></slot></div>
</template>

<script setup lang="ts">
import { Vector, Transform, Angle } from './Transform';
import Camera3D from './Camera3D.vue';
import { useTemplateRef } from 'vue';

const camera = useTemplateRef('cameraScene');

/////
// Set the Camera's position and angle
/////
const transformBuffer = new Transform();
const cameraPositionBuffer = new Vector();
const cameraAngleBuffer = new Angle();
let transformBufferChange = false;
function setCameraPos(x: null | number = null, y: null | number = null, z: null | number = null) {
	transformBufferChange = true;

	if (x !== null) {
		cameraPositionBuffer.x = x;
	}
	if (y !== null) {
		cameraPositionBuffer.y = y;
	}
	if (z !== null) {
		cameraPositionBuffer.z = z;
	}
}

function addToCameraPos(x: null | number = null, y: null | number = null, z: null | number = null) {
	transformBufferChange = true;
	if (x !== null) {
		cameraPositionBuffer.x += x;
	}
	if (y !== null) {
		cameraPositionBuffer.y += y;
	}
	if (z !== null) {
		cameraPositionBuffer.z += z;
	}
}

function setCameraAng(
	pitch: null | number = null,
	yaw: null | number = null,
	roll: null | number = null,
) {
	transformBufferChange = true;

	if (pitch !== null) {
		cameraAngleBuffer.pitch = pitch;
	}
	if (yaw !== null) {
		cameraAngleBuffer.yaw = yaw;
	}
	if (roll !== null) {
		cameraAngleBuffer.roll = roll;
	}
}

function addToCameraAng(
	pitch: null | number = null,
	yaw: null | number = null,
	roll: null | number = null,
) {
	transformBufferChange = true;
	if (pitch !== null) {
		cameraAngleBuffer.pitch += pitch;
	}
	if (yaw !== null) {
		cameraAngleBuffer.yaw += yaw;
	}
	if (roll !== null) {
		cameraAngleBuffer.roll += roll;
	}
}

function focusCameraOn(target: { transform: Transform }) {
	// const lookNormal = target.transform.getLookNormal();
	// setCameraPos(
	// 	target.transform.position.x + lookNormal.x * 100,
	// 	target.transform.position.y + lookNormal.y * 100,
	// 	target.transform.position.z + lookNormal.z * 100,
	// );
}

function checkForCameraTransformChange() {
	if (!camera.value) {
		return;
	}

	if (transformBufferChange) {
		transformBufferChange = false;

		cameraAngleBuffer.roll = 0;
		cameraAngleBuffer.pitch = cameraAngleBuffer.pitch > 179 ? 179 : cameraAngleBuffer.pitch;
		cameraAngleBuffer.pitch = cameraAngleBuffer.pitch < 1 ? 1 : cameraAngleBuffer.pitch;

		transformBuffer.setPosition(cameraPositionBuffer);
		transformBuffer.setAngle(cameraAngleBuffer);

		camera.value.transform.setPosition(cameraPositionBuffer);
		camera.value.transform.setAngle(cameraAngleBuffer);
	}
}

/////
// Main logic loop for updating
/////
let firstTick = true;
function tick() {
	if (!camera.value) {
		return;
	}

	if (mouseDown || firstTick || transformBufferChange) {
		firstTick = false;
		moveTick();
		checkForCameraTransformChange();
	}

	// This tick cascades to all children components
	camera.value.tick();
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

		// Blur the active element so we are not typing in text boxes
		if (document.activeElement && 'blur' in document.activeElement) {
			(document.activeElement as HTMLElement).blur();
		}
	}
}

function onMouseUp(event: MouseEvent) {
	if (event.button == 2) {
		mouseDown = false;
		moveForward = false;
		moveBackward = false;
		moveLeft = false;
		moveRight = false;
		moveRun = false;
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
		addToCameraAng(-diff.y * 0.25, diff.x * 0.25);

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

const moveVector = new Vector();
let moveForward = false;
let moveBackward = false;
let moveLeft = false;
let moveRight = false;
let moveRun = false;

function moveTick() {
	const speed = 15 * (moveRun ? 3 : 1);

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
		if (event.code == 'KeyW') {
			moveForward = true;
		} else if (event.code == 'KeyS') {
			moveBackward = true;
		} else if (event.code == 'KeyA') {
			moveLeft = true;
		} else if (event.code == 'KeyD') {
			moveRight = true;
		} else if (event.code == 'ShiftLeft') {
			moveRun = true;
		}
	}
}

function onKeyUp(event: KeyboardEvent) {
	if (event.code == 'KeyW') {
		moveForward = false;
	} else if (event.code == 'KeyS') {
		moveBackward = false;
	} else if (event.code == 'KeyA') {
		moveLeft = false;
	} else if (event.code == 'KeyD') {
		moveRight = false;
	} else if (event.code == 'ShiftLeft') {
		moveRun = false;
	}
}

defineExpose({ camera, setCameraPos, setCameraAng, focusCameraOn, tick });
</script>

<style scoped>
.debug {
	position: absolute;
	top: 0px;
	right: 0px;
	color: white;
	background-color: rgba(0, 0, 0, 0.25);
}
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
