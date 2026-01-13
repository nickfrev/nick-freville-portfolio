<template>
	<div class="object" :style="objectStyle">
		<Object3D>
			<Div3D
				class="defaultColor"
				:style="$attrs.style"
				:transform="rightTransform"
				:width="length"
				:height="height"
			>
				<slot name="right"></slot>
			</Div3D>
			<Div3D
				class="defaultColor"
				:style="$attrs.style"
				:transform="leftTransform"
				:width="length"
				:height="height"
			>
				<slot name="left"></slot>
			</Div3D>
			<Div3D
				class="defaultColor"
				:style="$attrs.style"
				:transform="frontTransform"
				:width="width"
				:height="height"
			>
				<slot name="front"></slot>
			</Div3D>
			<Div3D
				class="defaultColor"
				:style="$attrs.style"
				:transform="backTransform"
				:width="width"
				:height="height"
			>
				<slot name="back"></slot>
			</Div3D>
			<Div3D
				class="defaultColor"
				:style="$attrs.style"
				:transform="topTransform"
				:width="width"
				:height="length"
			>
				<slot name="top"></slot>
			</Div3D>
			<Div3D
				class="defaultColor"
				:style="$attrs.style"
				:transform="bottomTransform"
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
import { watch, ref } from 'vue';

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

const rightTransform = ref(new Transform(props.width / 2, 0, 0, 90, -90, 0));
const leftTransform = ref(new Transform(-props.width / 2, 0, 0, 90, 90, 0));
const frontTransform = ref(new Transform(0, props.length / 2, 0, -90, 0, 180));
const backTransform = ref(new Transform(0, -props.length / 2, 0, 90, 0, 0));
const topTransform = ref(new Transform(0, 0, props.height / 2, 0, 0, 0));
const bottomTransform = ref(new Transform(0, 0, -props.height / 2, 180, 0, 0));

watch(() => props.width, update);
watch(() => props.length, update);
watch(() => props.height, update);

function update() {
	rightTransform.value.setPosition(props.width / 2, 0, 0);
	leftTransform.value.setPosition(-props.width / 2, 0, 0);
	frontTransform.value.setPosition(0, props.length / 2, 0);
	backTransform.value.setPosition(0, -props.length / 2, 0);
	topTransform.value.setPosition(0, 0, props.height / 2);
	bottomTransform.value.setPosition(0, 0, -props.height / 2);
}
</script>

<style scoped>
@import '../ObjectComposable.css';
.defaultColor {
	background-color: rgb(150, 150, 150);
}
</style>
