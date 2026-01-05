<template>
	<div class="plane" :style="{ ...objectStyle, ...divDimensions }">
		<slot></slot>
	</div>
</template>

<script setup lang="ts">
import { objectProps, becomeObject } from './ObjectComposable';
import { ref, reactive } from 'vue';

const props = defineProps({
	...objectProps,
	width: {
		type: Number,
		default: 500,
	},
	height: {
		type: Number,
		default: 500,
	},
});
const { objectStyle, objectExposables } = becomeObject(props);
defineExpose(objectExposables);

const width = ref(props.width);
const height = ref(props.height);

objectExposables.transform.value.positionOffset.x = width.value / 2;
objectExposables.transform.value.positionOffset.y = height.value / 2;
objectExposables.update();

const divDimensions = reactive({
	width: `${width.value}px`,
	height: `${height.value}px`,
});
</script>

<style scoped>
.plane {
	display: block;
	box-sizing: border-box;

	top: 0px;
	right: 0px;

	position: absolute;
	backface-visibility: hidden;

	background-color: black;
	visibility: visible;
	transform-origin: center;
	transform-style: preserve-3d;
	transform-box: content-box;

	width: 100px;
	height: 100px;

	border: solid 1px black;
}
</style>
