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
import { ref, reactive } from 'vue';

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

const width = ref(props.width);
const height = ref(props.height);

const offset = objectExposables.transform.value.renderOffset;
offset.m41 = width.value / 2;
offset.m42 = -height.value / 2;
objectExposables.update();

const divDimensions = reactive({
	width: `${width.value}px`,
	height: `${height.value}px`,
});
</script>

<style scoped>
@import './ObjectComposable.css';
</style>
