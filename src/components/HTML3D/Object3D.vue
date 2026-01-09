<template>
	<div class="object" :style="objectStyle">
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
@import './ObjectComposable.css';
</style>
