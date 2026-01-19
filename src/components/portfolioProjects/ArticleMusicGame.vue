<template>
	<h1 style="color: white">Music Game</h1>
	<article>
		<p>
			This project is an unfinished music game I had worked on in college between classes. I was
			interested in how games like Audio Surf could dynamically generate gameplay based on music.
			With this project I tried my hand at extracting the base and general main melody of a music
			wave. I also played with getting the game to feel like it could recognize a song's "drop".
			That said... I think I went a bit overboard with how many bullets spawn after a drop.
		</p>
		<p>
			Another thing I tried to focus on was getting a nice visual effect of the game. Although I
			wish I could have added a more juicy feeling I'm content with how it turned out. The bullets
			have a motion blur effect and the main sound circle in the center has a nice visual feeling to
			it.
		</p>
		I never ended up implementing the collision detection or any sort of scoring system. Maybe I
		might finish that at some point in the future.
	</article>
	<PatchIFrameLoader :src="MusicGame" style="width: 900px; height: 600px"></PatchIFrameLoader>
	<a :href="MusicGame">Play Full Screen</a>
	<article>
		<p>Music Credits:</p>
		<p>TheFatRat - Unity</p>
		<p>Watch the official music video: https://tinyurl.com/unitytfr</p>
		<p>Listen to Unity: https://thefatrat.ffm.to/unity</p>
		<p>Follow TheFatRat: https://ffm.bio/thefatrat</p>
	</article>
</template>

<script setup lang="ts">
import MusicGame from './MusicGame/src/index.html';

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
