<template>
	<h1 style="color: white">Powder Engine</h1>
	<article>
		<p>
			This is another instance of me seeing something that someone made and feeling the need to
			program a small proof of concept project. In this case it's the classic powder toy.
		</p>
		<p>Up Arrow Key - Forward cycle through powder types.</p>
		<p>Down Arrow Key - Reverse cycle through powder types.</p>
		<p>Left Arrow Key - Spawn Powder tool.</p>
		<p>Right Arrow Key - "SnowBlower" tool.</p>
	</article>
	<PatchIFrameLoader :src="PowderGame" style="width: 900px; height: 600px"></PatchIFrameLoader>
	<a :href="PowderGame">Show Full Screen</a>
</template>

<script setup lang="ts">
import PowderGame from '/portfolioProjects/PowderGame/src/index.html?url';

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
