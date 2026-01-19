<template>
	<h1 style="color: white">Vector Field Path Finding</h1>
	<article>
		<p>
			The vector field search algorithm is a very useful algorithm when it comes to path finding for
			large groups of NPC's. In this demonstration of the classic vector field path finding, a
			simple area avoidance system has been added. As an area collects deaths, the area becomes less
			useful to the NPCs. If the NPCs can find a better way to take to get to the goal then they
			will use it. This displays some simple implementation of computer learning.
		</p>
	</article>
	<PatchIFrameLoader :src="VectorField" style="width: 955px; height: 805px"></PatchIFrameLoader>
</template>

<script setup lang="ts">
import VectorField from './VectorField/src/index.html';

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
