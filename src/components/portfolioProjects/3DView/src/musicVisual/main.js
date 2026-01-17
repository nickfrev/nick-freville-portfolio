import { Port, Instance, Vert, Edge, Vec3 } from './engine.js';
import { RGBtoHSV, HSVtoRGB } from './colors.js';

export default class MusicVisualizer {
	constructor(canvas, audioFile, audio, songFile) {
		this.running = false;
		this.allowMove = false;
		this.lasPos = { x: -1, y: -1 };

		this.plySpeed = 10;

		this.forward = 0;
		this.right = 0;

		this.curCol = 'rgb(100,100,255)';
		this.maxVal = Math.pow(128 / 30, 5) / 10;
		this.colCur = 0;
		this.curHue = 0;
		this.lasKick = 0;

		this.curWave = 0;

		this.mouseOverToPlay = true;

		this.canvas = canvas;
		this.ctx = this.canvas.getContext('2d');

		this.bindEventListeners();

		this.ctx.fillStyle = 'rgb(0,0,0)';
		this.ctx.fillRect(0, 0, canvas.width, canvas.height);

		this.audio = audio;
		this.audio.src = songFile;
		this.audio.controls = true;
		this.audio.loop = true;
		this.audio.autoplay = false;

		audioFile.addEventListener('change', () => {
			let files = audioFile.files;
			let file = URL.createObjectURL(files[0]);
			this.audio.src = file;
			this.audio.play();
		});

		this.initMp3Player();

		this.tmpPort = new Port(this.canvas);

		this.makeModel();
		this.draw();
	}

	makeModel() {
		this.square = 50;

		this.display = new Array(this.square);
		for (let x = 0; x < this.square; x++) {
			this.display[x] = new Array(this.square);
			for (let y = 0; y < this.square; y++) {
				this.display[x][y] = 0;
			}
		}

		this.scale = 20;
		for (let y = 0; y < this.square; y++) {
			for (let x = 0; x < this.square; x++) {
				let tmpObj = new Instance();
				tmpObj.mesh.verts[0] = new Vert(0, 0, 0);
				tmpObj.mesh.verts[1] = new Vert(0, this.scale, 0);
				tmpObj.mesh.verts[2] = new Vert(this.scale, this.scale, 0);
				tmpObj.mesh.verts[3] = new Vert(this.scale, 0, 0);

				tmpObj.mesh.edges[0] = new Edge(0, 1);
				tmpObj.mesh.edges[1] = new Edge(1, 2);
				tmpObj.mesh.edges[2] = new Edge(2, 3);
				tmpObj.mesh.edges[3] = new Edge(3, 0);

				tmpObj.pos.x = x * (this.scale + 0);
				tmpObj.pos.y = y * (this.scale + 0);
				tmpObj.pos.z = 0;

				this.tmpPort.addObj(tmpObj);
			}
		}
		this.tmpPort.cam.pos = new Vec3(-300, -600, 700);
		this.tmpPort.cam.ang = new Vec3(1.08, 0, -0.63);
	}

	start() {
		this.audio.play();
		this.running = true;
		this.draw();
	}

	stop() {
		this.audio.pause();
		this.running = false;
	}

	bindEventListeners() {
		this.canvas.addEventListener('mouseenter', () => {
			if (this.mouseOverToPlay) {
				this.start();
			}
		});

		this.canvas.addEventListener('mouseleave', () => {
			if (this.mouseOverToPlay) {
				this.stop();
			}
		});

		this.canvas.addEventListener(
			'mousemove',
			(evt) => {
				if (this.allowMove) {
					if (this.lasPos.x == -1) {
						this.lasPos = { x: evt.offsetX, y: evt.offsetY };
					}
					this.tmpPort.cam.ang.z -= (evt.offsetX - this.lasPos.x) / 100;
					this.tmpPort.cam.ang.x -= (evt.offsetY - this.lasPos.y) / 100;
					this.tmpPort.cam.updateDir();
					this.lasPos = { x: evt.offsetX, y: evt.offsetY };
				}
			},
			false,
		);

		this.canvas.addEventListener(
			'mousedown',
			(evt) => {
				this.lasPos = { x: evt.offsetX, y: evt.offsetY };
				this.allowMove = true;
			},
			false,
		);

		this.canvas.addEventListener(
			'mouseup',
			() => {
				this.allowMove = false;
			},
			false,
		);

		document.addEventListener(
			'keydown',
			(evt) => {
				//alert("keydown: " + evt.keyCode);
				if (evt.keyCode == 87) {
					//W
					this.forward = this.plySpeed;
				}
				if (evt.keyCode == 65) {
					//A
					this.right = this.plySpeed;
				}
				if (evt.keyCode == 83) {
					//S
					this.forward = -this.plySpeed;
				}
				if (evt.keyCode == 68) {
					//D
					this.right = -this.plySpeed;
				}
			},
			false,
		);

		document.addEventListener(
			'keyup',
			(evt) => {
				if (evt.keyCode == 87) {
					//W
					this.forward = 0;
				}
				if (evt.keyCode == 65) {
					//A
					this.right = 0;
				}
				if (evt.keyCode == 83) {
					//S
					this.forward = 0;
				}
				if (evt.keyCode == 68) {
					//D
					this.right = 0;
				}
			},
			false,
		);
	}

	camPos() {
		this.tmpPort.cam.pos.x -= this.tmpPort.cam.up.x * this.forward;
		this.tmpPort.cam.pos.y -= this.tmpPort.cam.up.y * this.forward;
		this.tmpPort.cam.pos.z -= this.tmpPort.cam.up.z * this.forward;

		this.tmpPort.cam.pos.x += this.tmpPort.cam.right.x * this.right;
		this.tmpPort.cam.pos.y += this.tmpPort.cam.right.y * this.right;
		this.tmpPort.cam.pos.z += this.tmpPort.cam.right.z * this.right;
	}

	setMove() {
		let xTrue = 0;
		let yTrue = 0;
		for (let y = 0; y < this.square; y++) {
			for (let x = 0; x < this.square; x++) {
				const i = y * this.square + x;
				const x1 = (x + this.curWave) % this.square;
				const y1 = y;
				if (x != this.square - 1) {
					xTrue = (x1 + 1) % this.square;
				} else {
					xTrue = x1;
				}
				yTrue = (y1 + 1) % this.square;

				this.tmpPort.objects[i].mesh.verts[0] = new Vert(0, 0, this.display[x1][y1]);
				this.tmpPort.objects[i].mesh.verts[3] = new Vert(this.scale, 0, this.display[xTrue][y1]);
				this.tmpPort.objects[i].mesh.verts[1] = new Vert(0, this.scale, this.display[x1][yTrue]);
				this.tmpPort.objects[i].mesh.verts[2] = new Vert(
					this.scale,
					this.scale,
					this.display[xTrue][yTrue],
				);
			}
		}
		//check for colors and whatnot
		let curKick = 0;
		for (let i = 0; i < 6; i++) {
			curKick += this.display[this.curWave][i];
		}
		const thresh = this.lasKick + this.maxVal * 6 * 0.05;
		if (curKick > thresh) {
			this.colCur += 1;
		}
		this.lasKick = curKick;
		if (this.colCur > 0) {
			this.colCur = this.colCur * 0.9;
		}
		//val of blue for low pitch
		curKick = 0;
		for (let i = 6; i < 20; i++) {
			curKick += this.display[this.curWave][i];
		}
		const b = (curKick / (this.maxVal * 14)) * 250;
		//val of green for mid pitch
		curKick = 0;
		for (let i = 20; i < 35; i++) {
			curKick += this.display[this.curWave][i];
		}
		const g = (curKick / (this.maxVal * 15)) * 250;
		//val of green for mid pitch
		curKick = 0;
		for (let i = 35; i < 50; i++) {
			curKick += this.display[this.curWave][i];
		}
		const r = (curKick / (this.maxVal * 15)) * 250;
		let tmp = RGBtoHSV(r, g, b);
		this.curHue += (tmp.h - this.curHue) * 0.05;
		tmp = HSVtoRGB(this.curHue, 1 - this.colCur, 0.8);

		this.curCol =
			'rgb(' + Math.round(tmp.r) + ',' + Math.round(tmp.g) + ',' + Math.round(tmp.b) + ')';
	}

	getAudioData() {
		this.curWave++;
		this.curWave = this.curWave % this.square;
		let fbc_array = new Uint8Array(this.analyser.frequencyBinCount);
		this.analyser.getByteFrequencyData(fbc_array);
		let bars = this.square + 1;
		for (let i = 1; i < bars - 1; i++) {
			let bar_x = this.square * 3 - i * 3;
			let bar_width = 2;
			let bar_height = fbc_array[i] / 2;
			this.display[this.curWave][i] = bar_height;
			this.ctx.fillRect(bar_x, 50, bar_width, -this.display[this.curWave][i] / 3);
		}
	}

	draw() {
		if (this.running) {
			requestAnimationFrame(this.draw.bind(this));
		}

		this.camPos();
		this.ctx.fillStyle = 'rgb(0,0,0)';
		this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
		this.setMove();
		this.ctx.strokeStyle = this.curCol;
		this.tmpPort.draw();
		this.ctx.fillStyle = 'rgb(255,0,0)';
		this.getAudioData();

		if (!this.running && this.mouseOverToPlay) {
			this.ctx.fillStyle = 'rgba(0,0,0, 0.7)';
			this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
			this.ctx.fillStyle = 'rgb(255,255,255)';
			this.ctx.textAlign = 'center';
			this.ctx.font = '48px serif';
			this.ctx.fillText('Mouse Over to Interact', this.canvas.width / 2, this.canvas.height / 2);
			this.ctx.font = '20px serif';
			this.ctx.fillText(
				'Left click and drag to move camera, WASD to move.',
				this.canvas.width / 2,
				this.canvas.height / 2 + 35,
			);
		}
	}

	// initMp3Player() {
	// 	const context = new AudioContext(); // AudioContext object instance
	// 	this.analyser = context.createAnalyser(); // AnalyserNode method
	// 	// Re-route audio playback into the processing graph of the AudioContext
	// 	const source = context.createMediaElementSource(this.audio);
	// 	source.connect(this.analyser);
	// 	this.analyser.connect(context.destination);
	// }

	initMp3Player() {
		const context = new AudioContext();
		const source = context.createMediaElementSource(this.audio);
		this.analyser = context.createAnalyser();
		source.connect(this.analyser);
		this.analyser.connect(context.destination);
	}
}
