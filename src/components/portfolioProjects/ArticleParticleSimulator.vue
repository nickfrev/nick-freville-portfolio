<template>
	<h1 style="color: white">Particle Simulator</h1>
	<ParticleSimulation></ParticleSimulation>
	<article>
		Physics has always been a fun thing to program for me. This is a small demo of some particle
		physics that used some behind the scenes programming to increase the efficiency of the physics.
		Rendering is reduced by drawing black particles where the current particles are on each screen
		draw so that the entire screen doesn't have to be cleared. Another method used is to section the
		screen into a matrix and track what cells the particles are in so that only adjacent cells have
		to be checked for colliding particles.
	</article>
</template>

<script setup lang="ts">
import ParticleSimulation from './ParticleSimulation/ParticleSimulation.vue';
</script>

<style scoped>
@import './global.css';

article {
	color: white;
	max-width: 800px;

	margin: 30px;
}
</style>
