<template>
	<!-- Curtain Simulator is very old at this point. Doing even
	  a small refactor would be more effort than it's worth. -->
	<iframe :src="CurtainSimulatorHTML"></iframe>
</template>

<script setup lang="ts">
// @ts-ignore
import CurtainSimulatorHTML from './src/index.html';
</script>

<style scoped>
iframe {
	width: 100%;
	height: 100%;
}
</style>
