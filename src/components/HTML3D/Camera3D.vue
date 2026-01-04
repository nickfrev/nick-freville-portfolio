<template>
	<div class="camera" :style="objectStyle">
		<slot></slot>
	</div>
</template>

<script setup lang="ts">
import { objectProps, becomeObject } from './ObjectComposable';
const props = defineProps(objectProps);
const { objectStyle, objectExposables } = becomeObject(props);
defineExpose(objectExposables);
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
