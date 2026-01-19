<template>
	<h1 style="color: white">3D View</h1>
	<BlenderExport></BlenderExport>
	<article>
		I've always been curious to learn how things work. As a child almost every one of my toys had
		been taken apart and reassembled a dozen times. As a programmer I have the same curiosity.
		<p>
			One of my hobbies is to program video games. It is one of the best things out there to program
			for someone that really wants to enjoy the act of programming. Why? Because it is one of the
			few things you can program that almost everyone will enjoy and understand. If I write some
			crazy algorithm that could tell you how to most efficiently pack variably shaped boxes into
			the back of a truck in O(1) time, most programmers would be gobsmacked. If I showed the same
			thing to my friends or family I'd probably get a courteous "Oh, that's nice." then the topic
			would change. Everyone can understand and be interested in something as visual as games.
		</p>
		<p>
			Having played with game engines for years I began to grow curious how they worked under the
			hood. I had picked up a fair bit of the mechanics just from working with large game engines
			like Unity, and I wanted to see if I could make something simple just using that knowledge.
			Having recently learned about the canvas tag in HTML and making a small game with that, I
			decided to see if I could make a vector 3D engine.
		</p>
		<p>The results turned out nicely:</p>
	</article>
	<EngineTest></EngineTest>
	<article>
		<p>
			I am really quite surprised with how smooth the engine worked. It only used canvas and some
			simple javascript. I really expected it to be somewhat laggy but even at the time it was
			pretty fast. The engine only uses javascript and thus it runs on the CPU but because it
			renders vectors and not a per-pixel calculation it can take advantage of having very few
			computations per frame. It only gets smoother as the years go on.
		</p>
		<p>
			Speaking of the limitations of javascript. I programed this somewhere around 2013, which was
			before classes were introduced to javascript. It was only recently, when I went back to update
			the code so that it could be used with vuejs, that I remembered that developers used to use
			functions to stand in for classes back then.
		</p>
		<img :src="FunctionClassImage" />
		<p>
			I learned a great deal from this project and I am very thankful for my mathematics background
			because the wikipedia article on 3D to 2D projection was a bit dense. As you look at that demo
			you might have the same thought as I did at the time: It sort of looks like a music
			visualizer. From that thought I created the following:
		</p>
	</article>
	<MusicVisualizer></MusicVisualizer>
	<article>
		<p>
			From there it only has one more obvious step. So with a bit of python code to help extract 3D
			models from Blender3D and rewriting the engine into a more robust version with it's own
			concepts of a physics engine and "shaders", we get this:
		</p>
	</article>
	<MusicRacer></MusicRacer>
	<article>
		<p>
			Lastly just for a bit of fun I played around with the previous mention of "shaders". It isn't
			a shader in the regular terminology but it separated out the logic for how vertices and edges
			are rendered. So in this example I'm rendering all of the vertices as squares to create a
			makeshift point cloud display.
		</p>
	</article>
	<PointCloud></PointCloud>
	<article></article>
</template>

<script setup lang="ts">
import BlenderExport from './3DView/BlenderExport.vue';
import EngineTest from './3DView/EngineTest.vue';
import MusicRacer from './3DView/MusicRacer.vue';
import MusicVisualizer from './3DView/MusicVisualizer.vue';
import PointCloud from './3DView/PointCloud.vue';
import FunctionClassImage from '../../assets/portfilioExtras/functionClass.png';
</script>

<style scoped>
@import './global.css';

article {
	color: white;
	max-width: 800px;

	margin: 30px;
}
</style>
