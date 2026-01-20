window.onload = init;

var curEng;
var center = { x: 0, y: 0 };
//planet gradients
var worldGrd;

var coolDown = new Array(100);
for (var i = 0; i < 100; i++) {
	coolDown[i] = 0;
}

var maxPercChange = 0;
var lastInten = -1;
var waveLast = new Array(100);
var waveChange = new Array(100);
function spawnEne() {
	//get the current intensity
	var curInten = 0;
	var changeInten = 0;
	for (var i = 20; i < wave.length; i++) {
		curInten += wave[i];
	}
	if (lastInten == -1) {
		lastInten = curInten;
		for (var i = 0; i < wave.length; i++) {
			waveLast[i] = wave[i];
		}
	}
	changeInten = curInten - lastInten;
	lastInten = curInten;
	//get the change in bars
	for (var i = 0; i < wave.length; i++) {
		waveChange[i] = waveLast[i] - wave[i];
		waveLast[i] = wave[i];
		//ctx.fillRect(i*8, 100, 5, -Math.abs(waveChange[i]));
	}
	//get some more values to determine how things are going
	var percChange = changeInten / curInten;

	var tmpRot = 0;
	var tmpDir;
	var angStep = Math.PI / 20; //if you change this change it in drawPlanWave
	for (var i = 20; i < wave.length; i++) {
		if (waveChange[i] > 8) {
			tmpRot = i - 20;
			tmpDir = { x: -Math.sin(angStep * tmpRot), y: Math.cos(angStep * tmpRot) };
			curEng.addObj(
				new grunt_pellet(
					{ x: center.x + tmpDir.x * 100, y: center.y + tmpDir.y * 100 },
					{ x: tmpDir.x, y: tmpDir.y },
				),
			);
		}
	}

	var tmpDir;
	if (bassVal - lastBassVal > 0.25) {
		tmpDir = { x: -Math.sin(Math.PI / 1.5), y: Math.cos(Math.PI / 1.5) };
		curEng.addObj(
			new spiral(
				{ x: center.x + tmpDir.x * 100, y: center.y + tmpDir.y * 100 },
				{ x: tmpDir.x, y: tmpDir.y },
			),
		);
		tmpDir = { x: -Math.sin(Math.PI / 0.75), y: Math.cos(Math.PI / 0.75) };
		curEng.addObj(
			new spiral(
				{ x: center.x + tmpDir.x * 100, y: center.y + tmpDir.y * 100 },
				{ x: tmpDir.x, y: tmpDir.y },
			),
		);
		tmpDir = { x: -Math.sin(0), y: Math.cos(0) };
		curEng.addObj(
			new spiral(
				{ x: center.x + tmpDir.x * 100, y: center.y + tmpDir.y * 100 },
				{ x: tmpDir.x, y: tmpDir.y },
			),
		);
	} else if (bassVal - lastBassVal > 0.1) {
		var count = 20;
		var angDist = Math.PI / (count / 2);
		for (var i = 0; i < count; i++) {
			tmpDir = { x: -Math.sin(angDist * i), y: Math.cos(angDist * i) };
			curEng.addObj(
				new grunt(
					{ x: center.x + tmpDir.x * 100, y: center.y + tmpDir.y * 100 },
					{ x: tmpDir.x, y: tmpDir.y },
				),
			);
		}
	}
}

var lastBassVal = 0;
var bassVal = 0;
function calcBassVal() {
	lastBassVal = bassVal;
	bassVal = 0;
	for (var i = 1; i < 10; i++) {
		bassVal += wave[i];
	}
	bassVal /= 10 * 138.7;
	if (isNaN(bassVal)) {
		bassVal = 0;
	}
}

function drawPlanWave(size) {
	ctx.save();
	ctx.translate(center.x, center.y);
	ctx.fillStyle = 'rgba(150,100,255,1)';
	var angStep = Math.PI / 20; //if you change this change it in SpawnEne
	var tmpSlide = false;
	for (var i = 20; i < wave.length; i++) {
		if (!tmpSlide && i >= 60) {
			ctx.rotate(angStep / 2);
			ctx.fillStyle = 'rgba(50,100,200,1)';
			tmpSlide = true;
		}
		ctx.fillRect(0, size, 5, wave[i]);
		ctx.rotate(angStep);
	}
	ctx.restore();
}

function tick() {
	//calc the music dissasembler :D
	calcBassVal();
	//spawn enemies
	spawnEne();
	//run the logic
	curEng.tick();
	//draw planet
	var planetSize = 80 + 20 * bassVal;

	//atmos
	worldGrd = ctx.createRadialGradient(
		center.x,
		center.y,
		planetSize,
		center.x,
		center.y,
		planetSize + 20,
	);
	worldGrd.addColorStop(0, 'rgb(250,0,250');
	worldGrd.addColorStop(1, 'rgba(1,1,1,0)');

	ctx.beginPath();
	ctx.fillStyle = worldGrd;
	ctx.arc(center.x, center.y, planetSize + 20, 0, 2 * Math.PI);
	ctx.fill();
	//towers
	drawPlanWave(planetSize);
	//ground
	ctx.beginPath();
	ctx.fillStyle = 'rgb(100,150,255)';
	ctx.arc(center.x, center.y, planetSize, 0, 2 * Math.PI);
	ctx.fill();

	//get audio and display it
	getAudioData();
}

// Create a new instance of an audio object and adjust some of its properties
var audio = new Audio();
audio.src = 'TheFatRat-Unity.mp3';
audio.controls = true;
audio.loop = true;
audio.autoplay = false;
audio.volume = 0.1;
// Establish all variables that your Analyser will use
var source, context, analyser, fbc_array, bars, bar_x, bar_width, bar_height;

function initMp3Player() {
	document.getElementById('audio_box').appendChild(audio);
	context = new AudioContext(); // AudioContext object instance
	analyser = context.createAnalyser(); // AnalyserNode method
	// Re-route audio playback into the processing graph of the AudioContext
	source = context.createMediaElementSource(audio);
	source.connect(analyser);
	analyser.connect(context.destination);
}

var wave = new Array(100);
function getAudioData() {
	var square = 100;
	fbc_array = new Uint8Array(analyser.frequencyBinCount);
	analyser.getByteFrequencyData(fbc_array);
	bars = square + 1;
	for (var i = 1; i < bars - 1; i++) {
		bar_x = square * 3 - i * 3;
		bar_width = 2;
		bar_height = fbc_array[i] / 2;

		//ctx.fillStyle = "rgb(100,150,200)";
		//ctx.fillRect(bar_x, 100, bar_width, -bar_height/3);

		bar_height = Math.pow(bar_height / 30, 5) / 10;
		//fillRect( x, y, width, height ) // Explanation of the parameters below
		//ctx.fillStyle = "rgb(150,100,200)";
		//ctx.fillRect(bar_x, 100, bar_width, -bar_height/3);
		const volumeOffset = 0.01 + 0.99 * audio.volume;
		wave[i] = bar_height / volumeOffset;
	}
}

function init() {
	canvas = document.getElementById('canvas');
	ctx = canvas.getContext('2d');

	canvas.width = window.innerWidth;
	canvas.height = window.innerHeight;
	center = { x: canvas.width / 2, y: canvas.height / 2 };
	ctx.fillStyle = 'rgba(0,1,0,1)';
	ctx.fillRect(0, 0, canvas.width, canvas.height);

	//setup the engine
	curEng = new Engine();
	//for (var i = 0; i < 100; i++) {
	//	curEng.addObj(new grunt({x:Math.random()*1000,y:Math.random()*500}));
	//}

	//setting up gradients
	worldGrd = ctx.createRadialGradient(center.x, center.y, 80, center.x, center.y, 120);
	worldGrd.addColorStop(0, 'rgb(150,250,250');
	//worldGrd.addColorStop(1,"white");
	worldGrd.addColorStop(1, 'rgba(1,1,1,0)');

	initMp3Player();

	setInterval(tick, 1000 / 60);
}
