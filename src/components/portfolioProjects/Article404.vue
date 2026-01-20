<template>
	<h1 style="color: white">404</h1>
	<article>
		<p>
			This project was the first thing I ever programed using the canvas tag. I had just gone to a
			presentation given by my friend Robert Szkutak at SUNY Fredonia about the Canvas tag and how
			it could be used to show graphics on a webpage. Having enjoyed programming games before this I
			decided to create a small game to play around with what I had learned.
		</p>
		<p>
			At this time in college I was still going for engineering and as such I was working through my
			physics courses. The game consists of the player being a sort of space worm using it's mouth
			to eat small space dust. As time goes on the space dust starts to be attracted to the worm by
			gravity. A neat little game element that fell out of this project was that if you get hit by
			space dust it will propel the space dust very fast in the opposite direction. This means that
			every mistake you make has a compounding effect on the overall gameplay.
		</p>
		<p>
			This game used to be the 404 page on my old portfolio, but I doubt many people saw it so I
			decided to give it a nice little place to be appreciated.
		</p>
	</article>
	<PatchIFrameLoader :src="Game404" style="width: 900px; height: 600px"></PatchIFrameLoader>
	<a :href="Game404">Play Full Screen</a>
</template>

<script setup lang="ts">
import Game404 from '/portfolioProjects/404/src/404.html?url';

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
