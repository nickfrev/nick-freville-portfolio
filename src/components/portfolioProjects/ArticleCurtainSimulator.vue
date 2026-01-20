<template>
	<PatchIFrameLoader
		:src="CurtainSimulator"
		style="width: 900px; height: 600px"
	></PatchIFrameLoader>
	<a :href="CurtainSimulator">Show Full Screen</a>
</template>

<script setup lang="ts">
import CurtainSimulator from '/portfolioProjects/CurtainSimulator/src/index.html?url';
import PatchIFrameLoader from './PatchIFrameLoader.vue';
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
