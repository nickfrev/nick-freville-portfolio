<template>
	<div class="object" :style="objectStyle">
		<Object3D>
			<Div3D
				class="defaultColor"
				:transform="new Transform(width / 2, 0, 0, 90, -90, 0)"
				:width="length"
				:height="height"
			>
				<slot name="right"></slot>
			</Div3D>
			<Div3D
				class="defaultColor"
				:transform="new Transform(-width / 2, 0, 0, 90, 90, 0)"
				:width="length"
				:height="height"
			>
				<slot name="left"></slot>
			</Div3D>
			<Div3D
				class="defaultColor"
				:transform="new Transform(0, length / 2, 0, -90, 0, 180)"
				:width="width"
				:height="height"
			>
				<slot name="front"></slot>
			</Div3D>
			<Div3D
				class="defaultColor"
				:transform="new Transform(0, -length / 2, 0, 90, 0, 0)"
				:width="width"
				:height="height"
			>
				<slot name="back"></slot>
			</Div3D>
			<Div3D
				class="defaultColor"
				:transform="new Transform(0, 0, height / 2, 0, 0, 0)"
				:width="width"
				:height="length"
			>
				<slot name="top"></slot>
			</Div3D>
			<Div3D
				class="defaultColor"
				:transform="new Transform(0, 0, -height / 2, 180, 0, 0)"
				:width="width"
				:height="length"
			>
				<slot name="bottom"></slot>
			</Div3D>
		</Object3D>
	</div>
</template>

<script setup lang="ts">
import Object3D from '../Object3D.vue';
import Div3D from '../Div3D.vue';
import { Transform } from '../Transform';
import { objectProps, becomeObject } from '../ObjectComposable';

const props = defineProps({
	...objectProps,
	width: {
		type: Number,
		default: 250,
	},
	length: {
		type: Number,
		default: 250,
	},
	height: {
		type: Number,
		default: 250,
	},
});
const { objectStyle, objectExposables } = becomeObject(props);
defineExpose({ ...objectExposables });
</script>

<style scoped>
@import '../ObjectComposable.css';
.defaultColor {
	background-color: white;
}
</style>
