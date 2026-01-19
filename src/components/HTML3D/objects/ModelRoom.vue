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
				class="defaultColor doorWallRight"
				:style="$attrs.style"
				:transform="frontRightTransform"
				:width="width / 2 - doorWidth"
				:height="doorHeight + 2"
			>
				<slot name="front-right"></slot>
			</Div3D>
			<Div3D
				class="defaultColor doorWallTop"
				:style="$attrs.style"
				:transform="frontTopTransform"
				:width="width"
				:height="height - doorHeight + 1"
			>
				<slot name="front-top"></slot>
			</Div3D>
			<Div3D
				class="defaultColor doorWallLeft"
				:style="$attrs.style"
				:transform="frontLeftTransform"
				:width="width / 2 - doorWidth"
				:height="doorHeight + 2"
			>
				<slot name="front-left"></slot>
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
		<slot></slot>
	</div>
</template>

<script setup lang="ts">
import { Transform } from '../Transform';
import { objectProps, becomeObject } from '../ObjectComposable';
import { ref, watch } from 'vue';

import Object3D from '../Object3D.vue';
import Div3D from '../Div3D.vue';

const props = defineProps({
	...objectProps,
	width: {
		type: Number,
		default: 1000,
	},
	length: {
		type: Number,
		default: 1000,
	},
	height: {
		type: Number,
		default: 1200,
	},
	doorHeight: {
		type: Number,
		default: 800,
	},
	doorWidth: {
		type: Number,
		default: 200,
	},
});

const { objectStyle, objectExposables } = becomeObject(props);
defineExpose({ ...objectExposables });

const rightTransform = ref(new Transform(0, 0, 0, 90, 90, 0));
const leftTransform = ref(new Transform(0, 0, 0, 90, -90, 0));

const frontRightTransform = ref(new Transform(0, 0, 0, 90, 0, 0));
const frontTopTransform = ref(new Transform(0, 0, 0, 90, 0, 0));
const frontLeftTransform = ref(new Transform(0, 0, 0, 90, 0, 0));

const backTransform = ref(new Transform(0, 0, 0, -90, 0, 180));
const topTransform = ref(new Transform(0, 0, 0, 180, 0, 0));
const bottomTransform = ref(new Transform(0, 0, 0, 0, 0, 0));

watch(() => props.width, update);
watch(() => props.length, update);
watch(() => props.height, update);

function update() {
	const zPos = props.height / 2;
	rightTransform.value.setPosition(props.width / 2, 0, zPos);
	leftTransform.value.setPosition(-props.width / 2, 0, zPos);

	const wallOffset = props.width / 4 + props.doorWidth / 2;
	frontRightTransform.value.setPosition(wallOffset, props.length / 2 - 1, props.doorHeight / 2);
	frontTopTransform.value.setPosition(0, props.length / 2, zPos + props.doorHeight / 2);
	frontLeftTransform.value.setPosition(-wallOffset, props.length / 2 - 1, props.doorHeight / 2);

	backTransform.value.setPosition(0, -props.length / 2, zPos);
	topTransform.value.setPosition(0, 0, props.height);
	bottomTransform.value.setPosition(0, 0, 0);
}
update();
</script>

<style scoped>
@import '../ObjectComposable.css';
.defaultColor {
	background-color: rgb(150, 150, 150);
}

.doorWallTop {
	border-bottom: 0px;
}

.doorWallLeft {
	border-top: 10px;
}

.doorWallRight {
	border-top: 0px;
}
</style>
