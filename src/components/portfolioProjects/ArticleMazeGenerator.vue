<template>
	<h1 style="color: white">Maze Generator and Solver</h1>
	<article>
		<p>
			Below is a randomly generated maze being solved using the A Star path finding algorithm. You
			can see all of the different paths that have been taken by the algorithm and ultimately how it
			finds the goal cell in the bottom right corner. When the time comes to update this article to
			vuejs I plan to make this much more intractable.
		</p>
	</article>
	<PatchIFrameLoader :src="MazeGenerator" style="width: 900px; height: 600px"></PatchIFrameLoader>
	<a :href="MazeGenerator">Show Full Screen</a>
</template>

<script setup lang="ts">
import MazeGenerator from '/portfolioProjects/MazeGenerator/src/index.html?url';

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
