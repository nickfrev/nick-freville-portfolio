<template>
	<div class="cameraSpace">
		<Camera3D ref="cameraScene">
			<slot></slot>
		</Camera3D>
	</div>
</template>

<script setup lang="ts">
import Camera3D from './Camera3D.vue';
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
	background-color: transparent;
	transform-origin: center center;
	overflow: hidden;

	transform: perspective(800px);
}
</style>
