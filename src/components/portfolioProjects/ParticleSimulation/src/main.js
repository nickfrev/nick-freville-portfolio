import { port, rect } from './powderEngine.js';
import { HSVtoRGB } from './colors.js';

export default class PowderEngine {
	spawnCount = 2;

	constructor(canvas) {
		this.canvas = canvas;
		this.on = false;
		this.runTick = 0;
		this.movesize = 5;

		this.spawnCount = 2;

		this.mx = 0;
		this.my = 0;
		this.dx = 0;
		this.dy = 0;

		this.ctx = canvas.getContext('2d');

		canvas.width = 800; //window.innerWidth;
		canvas.height = 400; //window.innerHeight;

		this.ctx.clearRect(0, 0, canvas.width, canvas.height);

		this.ctx.fillStyle = 'rgb(0,0,0)';

		this.ctx.fillRect(0, 0, canvas.width, canvas.height);

		this.world = new port(this.ctx, new rect(0, 0, 160, 80), 5, 5);

		for (let i = 0; i < 200; i++) {
			this.world.addNode({ x: i, y: 99 }, true);
			this.world.addNode({ x: i, y: 100 }, true);
			this.world.addNode({ x: i, y: 101 }, true);
			this.world.addNode({ x: i, y: 102 }, true);
		}

		this.bindListeners();
	}

	bindListeners() {
		this.canvas.addEventListener(
			'mousemove',
			(evt) => {
				this.dx = this.mx;
				this.dy = this.my;

				this.mx = evt.offsetX;
				this.my = evt.offsetY;

				this.dx = this.mx - this.dx;
				this.dy = this.my - this.dy;
			},
			false,
		);
	}

	start() {
		this.on = true;
		this.worldInterval = setInterval(() => {
			this.world.tick();
		}, 1000 / 60);
		this.runInterval = setInterval(() => {
			this.run();
		}, 1000 / 60);
		this.render();
	}

	stop() {
		this.on = false;
		clearInterval(this.worldInterval);
		clearInterval(this.runInterval);
	}

	render() {
		if (this.on) {
			this.world.draw();
			requestAnimationFrame(this.render.bind(this));
		}
	}

	run() {
		if (this.on) {
			this.runTick++;
			const curCol = HSVtoRGB(Math.sin(this.runTick / 1000) / 2 + 0.5, 1, 0.8);
			this.world.drawCol = 'rgb(' + curCol.r + ',' + curCol.g + ',' + curCol.b + ')';

			for (let i = 0; i < this.spawnCount; i++) {
				//particles right
				let tmp = this.world.addNode(
					{ x: 30 + (Math.random() - 0.5), y: 40 + (Math.random() - 0.5) },
					false,
				);
				tmp.vel = { x: Math.random() + 0.2, y: (Math.random() - 0.5) * 0.01 };
				tmp.col =
					'rgb(' +
					Math.round((this.runTick * 3 + 150) % 255) +
					',0,' +
					Math.round((this.runTick * 3) % 255) +
					')';
				//particles left
				tmp = this.world.addNode(
					{ x: 130 + (Math.random() - 0.5), y: 40 + (Math.random() - 0.5) },
					false,
				);
				tmp.vel = { x: -(Math.random() + 0.2), y: (Math.random() - 0.5) * 0.01 };
				tmp.col =
					'rgb(' +
					Math.round((this.runTick * 3 + 150) % 255) +
					',0,' +
					Math.round((this.runTick * 3) % 255) +
					')';
			}

			const mPos = {
				x: Math.floor(this.mx / this.world.pixelSize.w),
				y: Math.floor(this.my / this.world.pixelSize.h),
			};
			for (let x = -this.movesize; x < this.movesize; x++) {
				for (let y = -this.movesize; y < this.movesize; y++) {
					const cur = { x: mPos.x + x, y: mPos.y + y };
					if (cur.x > 0 && cur.x < this.world.bounds.w) {
						if (cur.y > 0 && cur.y < this.world.bounds.h) {
							for (let t = 0; t < this.world.wMatrix[cur.x][cur.y].length; t++) {
								this.world.wMatrix[cur.x][cur.y][t].curForce.x += this.dx / 2;
								this.world.wMatrix[cur.x][cur.y][t].curForce.y += this.dy / 2;
							}
						}
					}
				}
			}
		}
	}
}
