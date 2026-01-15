<template>
	{{ currentIndex }}
	<div class="center">
		<button :class="{ tabButtons: true, hide: currentIndex <= 0 }" @click="scrollRight">
			&lt;
		</button>
		<div
			:class="{
				ScrollContainer: true,
				ScrollLeft: scrollLeftFlag,
				Center: !scrollLeftFlag && !scrollRightFlag,
				ScrollRight: scrollRightFlag,
			}"
		>
			<div class="flexContainer sizeElement GlassBackground">
				<div v-for="i in itemsPerPage" :key="i" class="flexItem"></div>
			</div>
			<!-- <div class="ScrollItem" v-for="itemGroup in gridItems" :key="itemGroup.id"> -->
			<div class="ScrollItem" v-for="i in 5" :key="i">
				<!-- <img src="../../assets/curSim.png" /> -->
				<div v-if="gridItems[currentIndex + i - 3]" class="flexContainer GlassBackground">
					<div
						v-for="item in gridItems[currentIndex + i - 3]?.items"
						:key="item?.id"
						class="flexItem"
					>
						<div class="tile" v-if="item?.id !== undefined">
							<img src="../../assets/curSim.png" />
							{{ item?.title }}
						</div>
					</div>
				</div>
			</div>
		</div>
		<button
			:class="{ tabButtons: true, hide: currentIndex >= Math.floor(items.length / itemsPerPage) }"
			@click="scrollLeft"
		>
			&gt;
		</button>
	</div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import type { Ref } from 'vue';

type item = { id?: number; title: string };
type itemGroup = { id?: number; items: (item | null)[] };

const itemsPerPage = 9;

const items: item[] = [
	{ title: 'test1' },
	{ title: 'test2' },
	{ title: 'test3' },
	{ title: 'test4' },
	{ title: 'test5' },
	{ title: 'test6' },
	{ title: 'test7' },
	{ title: 'test8' },
	{ title: 'test9' },
	{ title: 'test10' },
	{ title: 'test11' },
	{ title: 'test12' },
	{ title: 'test13' },
	{ title: 'test14' },
	{ title: 'test15' },
	{ title: 'test16' },
	{ title: 'test17' },
	{ title: 'test18' },
	{ title: 'test19' },
	{ title: 'test20' },
	{ title: 'test21' },
	{ title: 'test22' },
	{ title: 'test23' },
	{ title: 'test24' },
	{ title: 'test25' },
	{ title: 'test26' },
	{ title: 'test27' },
	{ title: 'test28' },
	{ title: 'test29' },
];
const gridItems: Ref<itemGroup[]> = ref([]);
const currentIndex: Ref<number> = ref(0);
const scrollLeftFlag: Ref<boolean> = ref(false);
const scrollRightFlag: Ref<boolean> = ref(false);

function scrollLeft() {
	if (currentIndex.value >= Math.floor(items.length / itemsPerPage)) {
		return;
	}
	scrollLeftFlag.value = true;
	setTimeout(() => {
		scrollLeftFlag.value = false;
		currentIndex.value++;
		if (currentIndex.value >= Math.floor(items.length / itemsPerPage)) {
			currentIndex.value = Math.floor(items.length / itemsPerPage);
		}
	}, 300);
}

function scrollRight() {
	if (currentIndex.value <= 0) {
		return;
	}
	scrollRightFlag.value = true;
	setTimeout(() => {
		scrollRightFlag.value = false;
		currentIndex.value--;
		if (currentIndex.value < 0) {
			currentIndex.value = 0;
		}
	}, 300);
}

function update() {
	for (let i = 0; i < items.length; i++) {
		const currentItem = items[i] as item;
		const gridItemsGroup = Math.floor(i / itemsPerPage);
		const gridIndex = i % itemsPerPage;

		currentItem.id = i;

		if (!gridItems.value[gridItemsGroup]) {
			gridItems.value[gridItemsGroup] = { id: gridItemsGroup, items: [] };
			for (let x = 0; x < itemsPerPage; x++) {
				gridItems.value[gridItemsGroup].items.push(null);
			}
		}
		gridItems.value[gridItemsGroup].items[gridIndex] = currentItem;
	}
}
update();
</script>

<style scoped>
@import './global.css';
* {
	--scrollShift: 150px; /* Global variable */
	--opacityShift: 0.05;
}

.center {
	display: flex;
	justify-content: center;
	align-items: center;
	padding: 30px;
	min-height: 100%;
	width: 100%;
}

.ScrollContainer {
	position: relative;
}

.GlassBackground {
	position: relative;
	background-color: rgba(0, 0, 0, 0.2);
	padding: 30px 30px;
}

.ScrollItem {
	position: absolute;
	top: 0px;
	width: 100%;
	height: 100%;
	opacity: 0.1;
	z-index: 1;
	transition:
		opacity 0.3s ease-out,
		left 0.3s ease-out,
		z-index 0.3s ease-out;
}

.ScrollContainer.Center .ScrollItem {
	transition: none;
}

/* Left */
.ScrollContainer.ScrollLeft > div:nth-child(2) {
	left: calc(var(--scrollShift) * -3);
	opacity: 0;
}

.ScrollContainer.ScrollLeft > div:nth-child(3) {
	left: calc(var(--scrollShift) * -2);
	opacity: 0;
}

.ScrollContainer.ScrollLeft > div:nth-child(4) {
	left: calc(var(--scrollShift) * -1);
	opacity: var(--opacityShift);
}

.ScrollContainer.ScrollLeft > div:nth-child(5) {
	left: 0px;
	opacity: 1;
	z-index: 99;
}

.ScrollContainer.ScrollLeft > div:nth-child(6) {
	left: calc(var(--scrollShift) * 1);
	opacity: var(--opacityShift);
}

/* Center */
.ScrollContainer.Center > div:nth-child(2) {
	left: calc(var(--scrollShift) * -2);
	opacity: 0;
}

.ScrollContainer.Center > div:nth-child(3) {
	left: calc(var(--scrollShift) * -1);
	opacity: var(--opacityShift);
}

.ScrollContainer.Center > div:nth-child(4) {
	left: 0px;
	opacity: 1;
	z-index: 99;
}

.ScrollContainer.Center > div:nth-child(5) {
	left: calc(var(--scrollShift) * 1);
	opacity: var(--opacityShift);
}

.ScrollContainer.Center > div:nth-child(6) {
	left: calc(var(--scrollShift) * 2);
	opacity: 0;
}

/* Right */
.ScrollContainer.ScrollRight > div:nth-child(2) {
	left: calc(var(--scrollShift) * -1);
	opacity: var(--opacityShift);
}

.ScrollContainer.ScrollRight > div:nth-child(3) {
	left: 0px;
	opacity: 1;
	z-index: 99;
}

.ScrollContainer.ScrollRight > div:nth-child(4) {
	left: calc(var(--scrollShift) * 1);
	opacity: var(--opacityShift);
}

.ScrollContainer.ScrollRight > div:nth-child(5) {
	left: calc(var(--scrollShift) * 2);
	opacity: 0;
}

.ScrollContainer.ScrollRight > div:nth-child(6) {
	left: calc(var(--scrollShift) * 3);
	opacity: 0;
}

.flexContainer {
	display: flex;
	flex-direction: row;
	flex-wrap: wrap;
	justify-content: center;
	gap: 30px;

	max-width: calc((256px * 3 + 30px * 4));
	min-height: 100%;
}

.flexContainer.sizeElement {
	visibility: hidden;
}

.flexItem {
	width: 256px;
	aspect-ratio: 1.62;
	color: white;
}

.flexItem img {
	float: left;
	width: 100%;
}

.tabButtons {
	height: 100px;
	opacity: 0.25;
	transition: opacity 0.5s ease-out;
	font-size: 1.5rem;
	padding: 15px;

	z-index: 99;
}

.tabButtons:hover {
	opacity: 1;
}

.tabButtons.hide {
	opacity: 0;
	pointer-events: none;
}

.tile {
	position: relative;
	cursor: pointer;
	opacity: 0.6;
	transition: opacity 0.2s ease-out;

	width: 100%;
	height: 100%;
	text-align: center;
}

.tile:hover {
	opacity: 1;
}

.tile img {
	position: absolute;
	top: 0px;
	bottom: 0px;
	left: 0px;
	right: 0px;
	z-index: -1;
}
</style>
