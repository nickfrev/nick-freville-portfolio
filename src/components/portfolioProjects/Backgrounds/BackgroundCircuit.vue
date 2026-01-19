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

const size = 6;
const cellSize = size + 2;
const steps = 5;
const speed = 100; //iterations per frame
const port: {
	x: number;
	y: number;
	width: number;
	height: number;
	ctx: null | CanvasRenderingContext2D;
} = { x: 30, y: 30, width: 100, height: 50, ctx: null };

const runPerc = 0.6;
const nodeNum = 5;
const nodeList = new Array(nodeNum);
const data: boolean[][] = [];
let freeCells: number[] = [];
let running = true;
let setCnt = 0;

function check(inPos: { x: number; y: number }, inDir: { x: number; y: number }) {
	const x = Math.round(inPos.x + inDir.x);
	const y = Math.round(inPos.y + inDir.y);
	if (x < port.width && x >= 0 && y < port.height && y >= 0) {
		if (data[x]![y]) {
			return true;
		}
		if (data[x]![Math.round(inPos.y)] && data[Math.round(inPos.x)]![y]) {
			return true;
		}
	} else {
		return true;
	}
	return false;
}

function set(inPos: { x: number; y: number }, inVal: boolean) {
	const x = Math.round(inPos.x);
	const y = Math.round(inPos.y);
	if (x < port.width && x >= 0 && y < port.height && y >= 0) {
		if (!data[x]![y] && inVal == true) {
			setCnt++;
		}
		data[x]![y] = inVal;
	}
}

class node {
	alive = true;
	pos = { x: 0, y: 0 };
	dir = { x: 0, y: 0 };
	sleep = 0;
	choice: { x: number; y: number }[] = [];
	cCnt = 0;
	ctx: CanvasRenderingContext2D;

	constructor(inX: number, inY: number, ctx: CanvasRenderingContext2D) {
		this.ctx = ctx;
		this.alive = true;
		this.pos = { x: inX, y: inY };
		this.dir = { x: 0, y: 0 };
		this.sleep = Math.round(70 * Math.random());

		this.choice = [];
		this.choice[0] = { x: 0, y: 1 };
		this.choice[1] = { x: 1, y: 0 };
		this.choice[2] = { x: 0, y: -1 };
		this.choice[3] = { x: -1, y: 0 };
		this.choice[4] = { x: 1, y: 1 };
		this.choice[5] = { x: 1, y: -1 };
		this.choice[6] = { x: -1, y: -1 };
		this.choice[7] = { x: -1, y: 1 };
		this.cCnt = this.choice.length;
	}

	tick() {
		if (this.sleep > 0) {
			this.sleep--;
			if (this.sleep < 2) {
				this.sleep = 0;
				this.dir = this.getDir();
			}
		} else {
			if (this.dir.x == 0 && this.dir.y == 0) {
				this.alive = false;
			}
			if (!check(this.pos, this.dir)) {
				set(this.pos, true);
				this.pos.x += this.dir.x * (1 / steps);
				this.pos.y += this.dir.y * (1 / steps);
			} else {
				this.pos.x = Math.round(this.pos.x);
				this.pos.y = Math.round(this.pos.y);
				set(this.pos, true);
				this.sleep = 10;
			}
		}
		this.ctx.beginPath();
		this.ctx.arc(
			port.x + this.pos.x * cellSize,
			port.y + this.pos.y * cellSize,
			size / 3,
			0,
			2 * Math.PI,
		);
		this.ctx.stroke();
	}

	getDir(): { x: number; y: number } {
		const cur = Math.round(7 * Math.random());

		for (let q = 0; q < this.cCnt; q++) {
			if (!check(this.pos, this.choice[(q + cur) % this.cCnt])) {
				return this.choice[(q + cur) % this.cCnt] ?? { x: 0, y: 0 };
			}
		}
		return { x: 0, y: 0 };
	}

	//mix them
	mix() {
		for (let q = 0; q < 10; q++) {
			const index1 = Math.round((this.cCnt - 1) * Math.random());
			const index2 = Math.round((this.cCnt - 1) * Math.random());
			const tmp = this.choice[index1] ?? { x: 0, y: 0 };
			this.choice[index1] = this.choice[index2] ?? { x: 0, y: 0 };
			this.choice[index2] = tmp;
		}
	}
}

function makeArray() {
	//make the grid
	for (let x = 0; x < port.width; x++) {
		data[x] = [];
		for (let y = 0; y < port.height; y++) {
			data[x]![y] = false;
		}
	}

	//make the nodes
	for (let i = 0; i < nodeNum; i++) {
		nodeList[i] = new node(
			Math.round((port.width - 1) * Math.random()),
			Math.round((port.height - 1) * Math.random()),
			port.ctx as CanvasRenderingContext2D,
		);
		nodeList[i].mix();
	}

	//create the free cell array
	freeCells = [];
	const max = port.width * port.height - 1;
	for (let i = 0; i < max; i++) {
		freeCells[i] = i;
	}

	//mix it
	for (let q = 0; q < max; q++) {
		const index1 = Math.round(max * Math.random());
		const index2 = Math.round(max * Math.random());
		const tmp = freeCells[index1];
		freeCells[index1] = freeCells[index2] ?? 0;
		freeCells[index2] = tmp ?? 0;
	}
}

function run() {
	if (running) {
		requestAnimationFrame(run);
	}

	if (setCnt / (port.width * port.height) > runPerc) {
		running = false;
	}
	for (let t = 0; t < speed; t++) {
		for (let i = 0; i < nodeNum; i++) {
			if (nodeList[i].alive) {
				nodeList[i].tick();
			} else if (running) {
				//find a new spot for it
				for (let q = 0; q < 1; q++) {
					if (freeCells.length < 2) {
						running = false;
					}
					const cur = freeCells.shift();

					if (cur && !isNaN(cur)) {
						const curX = cur % port.width;
						const curY = Math.floor(cur / port.width);
						if (!data[curX]![curY]) {
							nodeList[i].pos = { x: curX, y: curY };
							nodeList[i].alive = true;
							nodeList[i].sleep = 10;
							break;
						}
					}
				}
			}
		}
	}
}

function init() {
	if (!canvas.value) {
		return;
	}
	//Create an interface for interacting with canvas in 2D
	port.ctx = canvas.value.getContext('2d');

	if (!port.ctx) {
		return;
	}
	setCnt = 0;
	running = true;

	port.ctx.fillStyle = 'rgb(0,0,0)';
	port.ctx.fillRect(0, 0, canvas.value.width, canvas.value.height);

	//make the port full screen
	port.width = Math.floor((canvas.value.width - 2 * port.x) / cellSize);
	port.height = Math.floor((canvas.value.height - 2 * port.y) / cellSize);

	port.ctx.strokeStyle = 'rgba(0,255,255,0.5)';
	makeArray();
	run();
}
</script>

<style scoped>
@import '../global.css';
</style>
