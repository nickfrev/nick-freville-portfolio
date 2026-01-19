<template>
	<h1 style="color: white">Lock Patent</h1>
	<article>
		<p>
			I've spent many hours watching lock picking videos on youtube. I really enjoy mechanical
			devices like clocks and locks. One of the things I've noticed about almost every single lock
			I've ever seen is that you can 'attack' the lock one piece at a time. So if a lock has 6 pins,
			one could set each pin individually. As a programmer this always reminding me of movies where
			they crack a password one letter or number at a time. Obviously that's not how it works in
			cryptography so why should it work the same way for a mechanical lock.
		</p>
		<p>
			The video below shows how a Disk Detainer lock would look like as it operates. Normal disk
			detainer locks cut the key at a specific angle instead of how this lock uses a stepped keyway
			style.
		</p>
	</article>
	<iframe
		class="youtubeVideo"
		src="https://www.youtube.com/embed/qnNYT2P-0QE?si=39-KlINl-yc7EhXc"
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
		This video shows how my design works. It uses the red pinion gear to join each of the disks
		together. Once a disk is engaged with the red pinion it effectively becomes linked to the other
		disks. You can't move one disk without affecting the other disks.
	</article>
	<iframe
		class="youtubeVideo"
		src="https://www.youtube.com/embed/9cT1tWYP9GE?si=32oC1mQmZoK8SDUl"
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
	width: 60%;
	aspect-ratio: 1.77;
}
</style>
