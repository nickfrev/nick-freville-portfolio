import { Port, Instance, Vert } from './engine.js';

export default class PointCloud {
	constructor(canvas) {
		this.running = false;
		this.allowMove = false;
		this.lasPos = { x: -1, y: -1 };

		this.plySpeed = 5;
		this.forward = 0;
		this.right = 0;

		this.cntx = 0;
		this.cnty = 0;

		this.canvas = canvas;

		this.ctx = this.canvas.getContext('2d');

		this.ctx.fillStyle = 'rgb(0,0,0)';
		this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

		this.createModel();
		this.tmpPort.cam.pos.x = -400;
		this.tmpPort.cam.ang.z = -1.32;
		this.tmpPort.cam.ang.x = 1.76;
		this.tmpPort.cam.updateDir();

		this.bindEventListeners();

		this.draw();
	}

	start() {
		this.running = true;
		this.draw();
	}

	stop() {
		this.running = false;
	}

	createModel() {
		this.tmpPort = new Port(this.canvas);
		this.tmpPort.cam.pos.z = 100;
		this.tmpPort.cam.ang = { x: 1.33, y: 0, z: -0.8 };

		this.square = 20;
		this.repeat = this.square;
		const scale = 5;

		this.cloud = [];
		for (let x = 0; x < this.square; x++) {
			this.cloud[x] = [];
			for (let y = 0; y < this.square; y++) {
				this.cloud[x][y] = [];
				for (let z = 0; z < this.square; z++) {
					let tmpObj = new Instance();
					tmpObj.mesh.verts[0] = new Vert(
						0,
						0,
						z * scale * 3 +
							Math.sin((x / this.repeat) * 6.28) * 10 -
							Math.cos((y / this.repeat) * 6.28) * 10 +
							20,
					);

					tmpObj.pos.x = x * (scale + 10) + Math.random() * 15;
					tmpObj.pos.y = y * (scale + 10) + Math.random() * 15;
					tmpObj.pos.z = 0;
					//add the object to the port
					this.tmpPort.addObj(tmpObj);
					this.cloud[x][y][z] = tmpObj;
				}
			}
		}
	}

	bindEventListeners() {
		this.canvas.addEventListener('mouseenter', () => {
			this.start();
		});

		this.canvas.addEventListener('mouseleave', () => {
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
		let cntSpeedx = 1.2;
		let cntSpeedy = 0.5;
		let cntSpeed = 0.1;

		this.cntx += cntSpeedx * cntSpeed;
		this.cnty += cntSpeedy * cntSpeed;

		//tmp vars for fun equations
		let hSqr = this.square / 2;

		for (let x = 0; x < this.square; x++) {
			for (let y = 0; y < this.square; y++) {
				for (let z = 0; z < this.square; z++) {
					const x1 = x + this.cntx;
					const y1 = y + this.cnty;
					this.cloud[x][y][z].pos.z =
						Math.sin((x1 / this.repeat) * 6.28) * 10 -
						Math.cos((y1 / this.repeat) * 6.28) * 10 +
						20;
					const tmpX = x - hSqr;
					const tmpY = y - hSqr;
					const tmpZ = z - hSqr;
					const tmpDist = Math.sqrt(tmpX * tmpX + tmpY * tmpY + tmpZ * tmpZ);
					if (tmpDist < Math.abs(Math.sin(this.cnty / 10) * (this.square / 2))) {
						this.cloud[x][y][z].color =
							'rgba(' + Math.floor(tmpDist * 20) + ',0,' + Math.floor(255 - tmpDist * 20) + ',0.3)';
						this.cloud[x][y][z].weight = 1;
					} else {
						this.cloud[x][y][z].color = 'rgba(255,255,255,0.05)';
						this.cloud[x][y][z].weight = 0;
					}
				}
			}
		}
	}

	draw() {
		if (this.running) {
			requestAnimationFrame(this.draw.bind(this));
		}
		this.camPos();
		this.ctx.fillStyle = 'rgba(0,0,0,1)';

		this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
		this.setMove();
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
