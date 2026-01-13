<template>
	<div
		:class="{ plane: true, showbackface: showBackface }"
		:style="{ ...objectStyle, ...divDimensions }"
	>
		<slot></slot>
	</div>
</template>

<script setup lang="ts">
import { objectProps, becomeObject } from './ObjectComposable';
import { watch, reactive } from 'vue';

const props = defineProps({
	...objectProps,
	width: {
		type: Number,
		default: 250,
	},
	height: {
		type: Number,
		default: 250,
	},
	showBackface: {
		type: Boolean,
		default: false,
	},
});
const { objectStyle, objectExposables } = becomeObject(props);
defineExpose(objectExposables);

watch(() => props.width, update);
watch(() => props.height, update);

const divDimensions = reactive({
	width: `${props.width}px`,
	height: `${props.height}px`,
});

function update() {
	const offset = objectExposables.transform.value.renderOffset;
	offset.m41 = props.width / 2;
	offset.m42 = -props.height / 2;
	objectExposables.update();

	divDimensions.width = `${props.width}px`;
	divDimensions.height = `${props.height}px`;
}
update();
</script>

<style scoped>
@import './ObjectComposable.css';
</style>
