<template>
	<canvas ref="canvas" class="canvas" :width="width" :height="height"
		>Your Browser does not support HTML5</canvas
	>
	<button @click="init">Regenerate</button>
</template>

<script setup lang="ts">
import { onMounted, useTemplateRef } from 'vue';
const canvas = useTemplateRef('canvas');

defineProps({
	width: {
		type: Number,
		default: 800,
	},
	height: {
		type: Number,
		default: 400,
	},
});

onMounted(init);

const nodes: { x: number; y: number; dirx: number; diry: number; time: number; alive: boolean }[] =
	[];
const data: number[][] = [];
let context: null | CanvasRenderingContext2D = null;

let canvasWidth: number = 0;
let canvasHeight: number = 0;

//edit these for funzies
const seeds = 200; //ammount of things that move around
const res = 9; //how close they get to eachother
const border = 5; //how far away from the edge they try to go (chages based on res)
const fill = 15; //How "full" the screen will get (lower is less)
const speed = 2; //how fast they go from place to place
const alpha = 0.05; //from 0 to 1 of how much alpha each particle has
const nodeSize = 3; //The size of the circles that are drawn
function sign(x: number) {
	if (x > 0) {
		return 1;
	} else {
		return -1;
	}
}

function editNode(num: number, inx: number, iny: number) {
	let tmpx: number;
	let tmpy: number;

	if (Math.random() > 0.5) {
		tmpx = 0;
	} else {
		tmpx = sign(Math.random() - 0.5);
	}
	if (Math.random() > 0.5) {
		tmpy = 0;
	} else {
		tmpy = sign(Math.random() - 0.5);
	}

	if (inx + tmpx < border) {
		tmpx = 1;
	}
	if (inx + tmpx > canvasWidth - border) {
		tmpx = -1;
	}
	if (iny + tmpy < border) {
		tmpy = 1;
	}
	if (iny + tmpy > canvasHeight - border) {
		tmpy = -1;
	}

	if (data[inx + tmpx]![iny + tmpy]! < fill) {
		data[inx + tmpx]![iny + tmpy]!++;
		nodes[num] = { x: inx, y: iny, dirx: tmpx, diry: tmpy, time: speed, alive: true };
	} else {
		nodes[num] = { x: inx, y: iny, dirx: tmpx, diry: tmpy, time: speed, alive: false };
	}
}

function run() {
	if (!context) {
		return;
	}
	let curNode;
	let x, y;
	context.strokeStyle = 'rgba(0,255,255,' + alpha + ')';
	for (let i = 0; i < nodes.length; i++) {
		curNode = nodes[i];
		if (!curNode) {
			continue;
		}
		if (curNode.alive) {
			context.beginPath();
			x = curNode.x + (curNode.dirx / speed) * (speed - curNode.time);
			y = curNode.y + (curNode.diry / speed) * (speed - curNode.time);
			curNode.time--;
			context.arc(x * res, y * res, nodeSize, 0, 2 * Math.PI);
			context.stroke();
			if (curNode.time < 0) {
				editNode(i, x, y);
			}
		}
	}
}

function init() {
	if (!canvas.value) {
		return;
	}
	//Create an interface for interacting with canvas in 2D
	context = canvas.value.getContext('2d') as CanvasRenderingContext2D;

	//Erase the contents of the canvas
	context.clearRect(0, 0, canvas.value.width, canvas.value.height);

	//Set the color of all vector drawings to black
	context.fillStyle = 'rgb(0,0,0)';

	//Draw a filled rectangle the size of the width and height of the canvas
	context.fillRect(0, 0, canvas.value.width, canvas.value.height);
	context.fillStyle = 'rgb(255,255,255)';

	canvasWidth = Math.floor(canvas.value.width / res);
	canvasHeight = Math.floor(canvas.value.height / res);
	for (let x = 0; x < canvasWidth; x++) {
		data[x] = [];
		for (let y = 0; y < canvasHeight; y++) {
			data[x]![y] = 0;
		}
	}

	let tx;
	let ty;
	for (let i = 0; i < seeds; i++) {
		tx = Math.floor(Math.random() * canvasWidth);
		ty = Math.floor(Math.random() * canvasHeight);
		if (data[tx]![ty] == 0) {
			data[tx]![ty] = 1;
			editNode(nodes.length, tx, ty);
		}
	}
	setInterval(run, 1000 / 60);
}
</script>

<style scoped>
@import '../global.css';
</style>
