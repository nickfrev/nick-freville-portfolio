import { Port, Instance, Vert, Edge } from './engine.js';

export default class EngineTest {
	allowMove = false;
	lasPos = { x: -1, y: -1 };
	canvas;
	forward = 0;
	right = 0;
	cntx = 0;
	cntSpeedx = 1.2;
	cnty = 0;
	cntSpeedy = 0.5;
	tmpPort;
	running = false;
	interval = null;

	constructor(canvas) {
		this.canvas = canvas;
		this.ctx = this.canvas.getContext('2d');

		this.ctx.fillStyle = 'rgb(0,0,0)';
		this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

		this.generateMesh();
		this.bindListeners();
		this.draw();
	}

	start() {
		this.running = true;
		this.draw();
		clearInterval(this.interval);
		this.interval = setInterval(this.setMove.bind(this), 20);
	}

	stop() {
		this.running = false;
		clearInterval(this.interval);
	}

	generateMesh() {
		this.tmpPort = new Port(this.canvas);
		this.tmpPort.cam.pos.x = -200;
		this.tmpPort.cam.pos.y = -200;
		this.tmpPort.cam.pos.z = 150;
		this.tmpPort.cam.ang = { x: 1.33, y: 0, z: -0.8 };
		//make a test object
		const square = 50;
		const repeat = square;
		const scale = 5;
		for (let x = 0; x < square; x++) {
			for (let y = 0; y < square; y++) {
				let tmpObj = new Instance();
				tmpObj.mesh.verts[0] = new Vert(
					0,
					0,
					Math.sin((x / repeat) * 6.28) * 10 - Math.cos((y / repeat) * 6.28) * 10 + 20,
				);
				tmpObj.mesh.verts[1] = new Vert(
					0,
					scale,
					Math.sin((x / repeat) * 6.28) * 10 - Math.cos(((y + 1) / repeat) * 6.28) * 10 + 20,
				);
				tmpObj.mesh.verts[2] = new Vert(
					scale,
					scale,
					Math.sin(((x + 1) / repeat) * 6.28) * 10 - Math.cos(((y + 1) / repeat) * 6.28) * 10 + 20,
				);
				tmpObj.mesh.verts[3] = new Vert(
					scale,
					0,
					Math.sin(((x + 1) / repeat) * 6.28) * 10 - Math.cos((y / repeat) * 6.28) * 10 + 20,
				);

				tmpObj.mesh.verts[4] = new Vert(0, 0, 0);
				tmpObj.mesh.verts[5] = new Vert(0, scale, 0);
				tmpObj.mesh.verts[6] = new Vert(scale, scale, 0);
				tmpObj.mesh.verts[7] = new Vert(scale, 0, 0);

				tmpObj.mesh.edges[0] = new Edge(0, 1);
				tmpObj.mesh.edges[1] = new Edge(1, 2);
				tmpObj.mesh.edges[2] = new Edge(2, 3);
				tmpObj.mesh.edges[3] = new Edge(3, 0);

				tmpObj.mesh.edges[4] = new Edge(4, 5);
				tmpObj.mesh.edges[5] = new Edge(5, 6);
				tmpObj.mesh.edges[6] = new Edge(6, 7);
				tmpObj.mesh.edges[7] = new Edge(7, 4);

				tmpObj.mesh.edges[8] = new Edge(4, 0);
				tmpObj.mesh.edges[9] = new Edge(5, 1);
				tmpObj.mesh.edges[10] = new Edge(6, 2);
				tmpObj.mesh.edges[11] = new Edge(7, 3);

				tmpObj.pos.x = x * (scale + 10);
				tmpObj.pos.y = y * (scale + 10);
				tmpObj.pos.z = 0;
				//add the object to the port
				this.tmpPort.addObj(tmpObj);
			}
		}
	}

	bindListeners() {
		this.canvas.addEventListener('mouseenter', (evt) => {
			this.start();
		});

		this.canvas.addEventListener('mouseleave', (evt) => {
			this.stop();
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

		this.canvas.addEventListener('mousewheel', function () {}, false);

		this.canvas.addEventListener(
			'mousedown',
			(evt) => {
				if (evt.button == 0) {
					this.lasPos = { x: evt.offsetX, y: evt.offsetY };
					this.allowMove = true;
				}
			},
			false,
		);

		this.canvas.addEventListener(
			'mouseup',
			(evt) => {
				this.allowMove = false;
			},
			false,
		);
		let plySpeed = 5;
		document.addEventListener(
			'keydown',
			(evt) => {
				if (evt.keyCode == 87) {
					//W
					this.forward = plySpeed;
				}
				if (evt.keyCode == 65) {
					//A
					this.right = plySpeed;
				}
				if (evt.keyCode == 83) {
					//S
					this.forward = -plySpeed;
				}
				if (evt.keyCode == 68) {
					//D
					this.right = -plySpeed;
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
		this.cntx += this.cntSpeedx;
		this.cnty += this.cntSpeedy;
		const square = 50;
		const repeat = square;
		const scale = 5;
		for (let x = 0; x < square; x++) {
			for (let y = 0; y < square; y++) {
				let i = y * square + x;
				let x1 = x + this.cntx;
				let y1 = y + this.cnty;
				this.tmpPort.objects[i].mesh.verts[0] = new Vert(
					0,
					0,
					Math.sin((x1 / repeat) * 6.28) * 10 - Math.cos((y1 / repeat) * 6.28) * 10 + 20,
				);
				this.tmpPort.objects[i].mesh.verts[1] = new Vert(
					0,
					scale,
					Math.sin(((x1 + 1) / repeat) * 6.28) * 10 - Math.cos((y1 / repeat) * 6.28) * 10 + 20,
				);
				this.tmpPort.objects[i].mesh.verts[2] = new Vert(
					scale,
					scale,
					Math.sin(((x1 + 1) / repeat) * 6.28) * 10 -
						Math.cos(((y1 + 1) / repeat) * 6.28) * 10 +
						20,
				);
				this.tmpPort.objects[i].mesh.verts[3] = new Vert(
					scale,
					0,
					Math.sin((x1 / repeat) * 6.28) * 10 - Math.cos(((y1 + 1) / repeat) * 6.28) * 10 + 20,
				);
			}
		}
	}

	draw() {
		if (this.running) {
			requestAnimationFrame(this.draw.bind(this));
		}
		this.camPos();
		this.ctx.fillStyle = 'rgb(0,0,0)';
		this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

		this.tmpPort.draw();
		if (!this.running) {
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
}
