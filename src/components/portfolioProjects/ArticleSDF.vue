<template>
	<h1 style="color: white">Signed Distance Functions and Raymarching</h1>
	<article>
		<p>
			Signed Distance Functions (SDFs) are some of the coolest methods of rendering I've ever seen.
			Modern 3D engines store information on models by using vertices, edges, UV Textures, animation
			frames, etc. SDFs store models with mathematical functions. This ultimately means that you can
			have infinitely detailed objects shown. This is most obvious when rendering fractals. Below
			you can see two videos of a mandelbulb that I rendered using shaders in the Unity3D game
			engine.
		</p>
		<p>
			There is far too much to go into around SDFs for this writeup so below those videos I've
			attached some amazing resources on the topic that do a much better job than I ever could do.
		</p>
	</article>

	<iframe
		class="youtubeVideo"
		src="https://www.youtube.com/embed/g8foE9Ki-UA?si=mXaf0GeJSZvdDnTo"
		title="YouTube video player"
		frameborder="0"
		allow="
			accelerometer;
			autoplay;
			clipboard-write;
			encrypted-media;
			gyroscope;
			picture-in-picture;
			web-share;
		"
		referrerpolicy="strict-origin-when-cross-origin"
		allowfullscreen
	></iframe>

	<iframe
		class="youtubeVideo"
		src="https://www.youtube.com/embed/n931uZ1zZPo?si=b9wslIbgFGKpGhPi"
		title="YouTube video player"
		frameborder="0"
		allow="
			accelerometer;
			autoplay;
			clipboard-write;
			encrypted-media;
			gyroscope;
			picture-in-picture;
			web-share;
		"
		referrerpolicy="strict-origin-when-cross-origin"
		allowfullscreen
	></iframe>

	<article>
		<p>
			This video by kishimisu on youtube shows how the Raymarching algorithm works and
			<a href="https://iquilezles.org/articles/distfunctions/">this article by Inigo Quilez</a> is
			almost mandatory for those getting into SDFs.
		</p>
	</article>
	<iframe
		class="youtubeVideo"
		src="https://www.youtube.com/embed/khblXafu7iA?si=winoUYlnAoc1vpQ2"
		title="YouTube video player"
		frameborder="0"
		allow="
			accelerometer;
			autoplay;
			clipboard-write;
			encrypted-media;
			gyroscope;
			picture-in-picture;
			web-share;
		"
		referrerpolicy="strict-origin-when-cross-origin"
		allowfullscreen
	></iframe>
</template>

<script setup lang="ts"></script>

<style scoped>
@import './global.css';

article {
	color: white;
	max-width: 800px;

	margin: 30px;
}

.youtubeVideo {
	width: 40%;
	aspect-ratio: 1.77;
}

a {
	color: var(--primary-color);
}
</style>
