<template>
	<h1 style="color: white">Background Generator</h1>
	<article>
		I wanted to try my hand at creating a some backgrounds for a project a long time ago. The first
		algorithm I came up with is a "white noise" style algorithm but done in an organic way. This
		algorithm simulates multiple nodes that are trying to find empty cells. If a node enters a cell
		that has too high a value it will die off.
	</article>
	<BackgroundMold></BackgroundMold>
	<article>
		This background is meant to look like a circuit board. At first I tried to program this using
		line intersection testing but I found it was much more efficient to do it with a state grid, or
		a matrix filled with boolean values.
	</article>
	<BackgroundCircuit></BackgroundCircuit>
</template>

<script setup lang="ts">
import BackgroundMold from './Backgrounds/BackgroundMold.vue';
import BackgroundCircuit from './Backgrounds/BackgroundCircuit.vue';
</script>

<style scoped>
@import './global.css';

article {
	color: white;
	max-width: 800px;

	margin: 30px;
}
</style>
