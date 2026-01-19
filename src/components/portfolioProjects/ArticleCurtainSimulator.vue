<template>
	<CurtainSimulator class="curtain"></CurtainSimulator>
</template>

<script setup lang="ts">
import CurtainSimulator from './CurtainSimulator/CurtainSimulator.vue';
</script>

<style scoped>
@import './global.css';

.curtain {
	position: absolute;
	top: 0px;
	left: 0px;
	right: 0px;
	bottom: 0px;
}

article {
	color: white;
	max-width: 800px;

	margin: 30px;
}
</style>
