<template>
	<h1 style="color: white">Terminal</h1>
	<article>
		<p>
			This was a small fun project I did to play around with trying to make an old crt monitor
			looking screen. This small demo run a super simple terminal. To see all of the commands, type
			'help'. The 'run' command doesn't do anything as of now.
		</p>
	</article>
	<PatchIFrameLoader :src="Terminal" style="width: 900px; height: 600px"></PatchIFrameLoader>
	<a :href="Terminal">Play Full Screen</a>
</template>

<script setup lang="ts">
import Terminal from '/portfolioProjects/Terminal/src/index.html?url';

import PatchIFrameLoader from './PatchIFrameLoader.vue';
</script>

<style scoped>
@import './global.css';

article {
	color: white;
	max-width: 800px;

	margin: 30px;
}
</style>
