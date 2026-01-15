<template>
	<div class="object" :style="objectStyle">
		<ModelCube
			ref="sign"
			:width="width"
			:height="height"
			:length="signThickness"
			:transform="new Transform(0, 0, signHeight)"
			:style="$attrs.style"
		>
			<template v-slot:front>
				<slot></slot>
			</template>
		</ModelCube>

		<ModelCube
			ref="sign"
			:width="signThickness / 2"
			:height="signHeight - height / 2 + 10"
			:length="signThickness / 2"
			:transform="new Transform(0, 0, (signHeight - height / 2) / 2 + 5)"
			:style="$attrs.style"
		>
		</ModelCube>
	</div>
</template>

<script setup lang="ts">
import ModelCube from './ModelCube.vue';
import { Transform } from '../Transform';
import { objectProps, becomeObject } from '../ObjectComposable';
import { ref } from 'vue';

const signThickness = ref(18);
const props = defineProps({
	...objectProps,
	width: {
		type: Number,
		default: 250,
	},
	signHeight: {
		type: Number,
		default: 250,
	},
	height: {
		type: Number,
		default: 150,
	},
});
const { objectStyle, objectExposables } = becomeObject(props);
defineExpose({ ...objectExposables });
</script>

<style scoped>
@import '../ObjectComposable.css';
.defaultColor {
	background-color: rgb(150, 150, 150);
}
</style>
