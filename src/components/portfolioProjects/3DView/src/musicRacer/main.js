import { Port, Instance, Vert, Edge, Vec3 } from './engine.js';
import { RGBtoHSV, HSVtoRGB } from './colors.js';

function clamp(val, min, max) {
	if (val < min) {
		return min;
	}
	if (val > max) {
		return max;
	}
	return val;
}

export default class MusicRacer {
	constructor(canvas, audioFile, audio, songFile) {
		this.lasPos = { x: -1, y: -1 };
		this.plySpeed = 5;
		this.forward = 0;
		this.right = 0;
		this.curCnt = 0;
		this.scale = 20;

		this.curCol = 'rgb(100,100,255)';
		this.maxVal = Math.pow(128 / 30, 5) / 10;
		this.colCur = 0;
		this.curHue = 0;
		this.lasKick = 0;
		this.moveSpeed = 1;

		this.square = 50;

		this.curWave = 0;
		this.display = [];

		this.thrustHeight = 10;

		this.isStarted = false;
		this.ply = new Instance();

		this.display = new Array(this.square);

		this.audio = audio;
		this.audio.src = songFile;
		this.audio.controls = true;
		this.audio.loop = false;
		this.audio.autoplay = false;
		this.audio.volume = 0.2; // I very must dislike things that start out too loud

		this.canvas = canvas;
		this.ctx = this.canvas.getContext('2d');

		this.ctx.fillStyle = 'rgb(0,0,0)';
		this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

		this.tmpPort = new Port(this.canvas);
		this.createModels();

		//add load file ability
		audioFile.addEventListener('change', () => {
			let files = this.files;
			let file = URL.createObjectURL(files[0]);
			this.audio.src = file;
		});
		// audioBox.appendChild(this.audio);
		this.initMp3Player();

		this.bindListeners();
		this.stop();
	}

	start() {
		this.audio.play();
		this.intervalMain = setInterval(this.draw.bind(this), 1000 / 30); //too much fluctuation in requestAnimationFrame
	}

	stop() {
		this.audio.pause();
		clearInterval(this.intervalMain);
		this.intervalMain = null;

		this.draw();
		this.ctx.fillStyle = 'rgba(0,0,0, 0.7)';
		this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
		this.ctx.fillStyle = 'rgb(255,255,255)';
		this.ctx.textAlign = 'center';
		this.ctx.font = '48px serif';
		this.ctx.fillText('Mouse Over to Interact', this.canvas.width / 2, this.canvas.height / 2);
		this.ctx.font = '20px serif';
		this.ctx.fillText(
			'Use A to move left and D to move right.',
			this.canvas.width / 2,
			this.canvas.height / 2 + 35,
		);
	}

	createModels() {
		for (let x = 0; x < this.square; x++) {
			this.display[x] = new Array(this.square);
			for (let y = 1; y < this.square; y++) {
				this.display[x][y] = 0;
			}
			this.display[x][0] = 200;
			this.display[x][this.square] = 200;
		}

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
				if (false) {
					tmpObj.mesh.verts[4] = new Vert(0, 0, 0);
					tmpObj.mesh.verts[5] = new Vert(0, this.scale, 0);
					tmpObj.mesh.verts[6] = new Vert(this.scale, this.scale, 0);
					tmpObj.mesh.verts[7] = new Vert(this.scale, 0, 0);

					tmpObj.mesh.edges[4] = new Edge(4, 5);
					tmpObj.mesh.edges[5] = new Edge(5, 6);
					tmpObj.mesh.edges[6] = new Edge(6, 7);
					tmpObj.mesh.edges[7] = new Edge(7, 4);

					tmpObj.mesh.edges[8] = new Edge(4, 0);
					tmpObj.mesh.edges[9] = new Edge(5, 1);
					tmpObj.mesh.edges[10] = new Edge(6, 2);
					tmpObj.mesh.edges[11] = new Edge(7, 3);
				}
				tmpObj.pos.x = x * (this.scale + 0);
				tmpObj.pos.y = y * (this.scale + 0);
				tmpObj.pos.z = 0;
				//add the object to the port
				if (y % 2 == x % 2) {
					tmpObj.visible = false;
				}
				this.tmpPort.addObj(tmpObj);
			}
		}
		this.tmpPort.cam.pos = new Vec3((this.square * this.scale) / 2, -174, 285);
		this.tmpPort.cam.ang = new Vec3(1.2, 0, 0);

		//playerinfo

		this.ply.pos = new Vec3(0, (this.square * this.scale) / 2, 200);
		this.ply.ang = new Vec3(0, 0, 0);
		this.ply.visible = false;
		let objVerts = [
			-0.8149446249008179, 0.21837276220321655, -0.2168692648410797, 0.3748595118522644,
			0.21837252378463745, -0.29661595821380615, -0.8149446249008179, 0.21837276220321655,
			0.2168692648410797, 0.3748595118522644, 0.21837252378463745, 0.29661595821380615,
			1.0139691829681396, 0.04097886383533478, -0.1475244164466858, 1.0139691829681396,
			0.04097886383533478, -0.048873528838157654, 0.3826572895050049, 0.16998028755187988,
			0.23823076486587524, 0.9174975156784058, 0.021528035402297974, -0.050892822444438934,
			-0.7737244367599487, 0.3379579186439514, -0.1623140126466751, -0.7737244367599487,
			0.3379579186439514, 0.1623140126466751, 0.9156709909439087, 0.37036287784576416, 0.0,
			0.3413369357585907, 0.6770395040512085, 0.0, 0.6285040974617004, 0.5237012505531311, 0.0,
			-0.2200426161289215, 0.21837270259857178, 0.29661595821380615, -0.22004255652427673,
			0.21837270259857178, -0.29661595821380615, -0.22004255652427673, 0.33795785903930664,
			0.1623140126466751, -0.22004255652427673, 0.33795785903930664, -0.1623140126466751,
			0.1043887734413147, 0.3541603684425354, -0.1623140126466751, -0.18388891220092773,
			0.5237012505531311, -0.1623140126466751, -0.47105592489242554, 0.6770396828651428,
			-0.1623140126466751, -0.18388891220092773, 0.5237012505531311, 0.1623140126466751,
			0.1043887734413147, 0.3541603684425354, 0.1623140126466751, -0.47105592489242554,
			0.6770396828651428, 0.1623140126466751, 0.37485942244529724, 0.07006457448005676,
			0.29661595821380615, 0.37485942244529724, 0.07006457448005676, -0.29661595821380615,
			-0.8149446249008179, 0.07006478309631348, 0.25674259662628174, -0.8149446249008179,
			0.07006478309631348, -0.25674259662628174, 1.0139691829681396, -0.01863233745098114,
			-0.048873528838157654, 1.0139691829681396, -0.01863233745098114, -0.1475244164466858,
			0.3826572000980377, 0.045868441462516785, 0.23823076486587524, 0.9174975156784058,
			-0.028357721865177155, -0.050892822444438934, -0.2200426161289215, 0.07006466388702393,
			-0.29661595821380615, -0.2200426161289215, 0.07006466388702393, 0.29661595821380615,
			-0.08570979535579681, 0.03657573461532593, 0.342725932598114, 0.24052664637565613,
			0.03657567501068115, 0.342725932598114, -0.7418392300605774, 0.16768836975097656,
			-0.1427539885044098, -0.7418392300605774, 0.16768836975097656, 0.1427539885044098,
			-0.7418392300605774, 0.07006478309631348, 0.16900058090686798, -0.7418392300605774,
			0.07006478309631348, -0.16900058090686798, -0.8149446249008179, -0.37485915422439575,
			-0.2168692648410797, 0.3748593330383301, -0.3748593330383301, -0.29661595821380615,
			-0.8149446249008179, -0.37485915422439575, 0.2168692648410797, 0.3748593330383301,
			-0.3748593330383301, 0.29661595821380615, 1.0139691829681396, -0.19746588170528412,
			-0.1475244164466858, 1.0139691829681396, -0.19746588170528412, -0.048873528838157654,
			0.38265711069107056, -0.3264670670032501, 0.23823076486587524, 0.9174975156784058,
			-0.17801496386528015, -0.050892822444438934, -0.7737245559692383, -0.4944443702697754,
			-0.1623140126466751, -0.7737245559692383, -0.4944443702697754, 0.1623140126466751,
			0.9156706929206848, -0.5268498063087463, 0.0, 0.3413366675376892, -0.833526611328125, 0.0,
			0.6285037994384766, -0.6801882982254028, 0.0, -0.22004272043704987, -0.3748592138290405,
			0.29661595821380615, -0.2200426608324051, -0.3748592138290405, -0.29661595821380615,
			-0.22004269063472748, -0.4944444000720978, 0.1623140126466751, -0.22004269063472748,
			-0.4944444000720978, -0.1623140126466751, 0.10438862442970276, -0.5106469988822937,
			-0.1623140126466751, -0.18388909101486206, -0.6801881194114685, -0.1623140126466751,
			-0.47105613350868225, -0.8335263729095459, -0.1623140126466751, -0.18388909101486206,
			-0.6801881194114685, 0.1623140126466751, 0.10438862442970276, -0.5106469988822937,
			0.1623140126466751, -0.47105613350868225, -0.8335263729095459, 0.1623140126466751,
			0.37485945224761963, -0.2265513688325882, 0.29661595821380615, 0.37485945224761963,
			-0.2265513688325882, -0.29661595821380615, -0.8149446249008179, -0.22655117511749268,
			0.25674259662628174, -0.8149446249008179, -0.22655117511749268, -0.25674259662628174,
			1.0139691829681396, -0.1378546804189682, -0.048873528838157654, 1.0139691829681396,
			-0.1378546804189682, -0.1475244164466858, 0.3826572299003601, -0.2023552507162094,
			0.23823076486587524, 0.9174975156784058, -0.12812921404838562, -0.050892822444438934,
			-0.2200426459312439, -0.22655129432678223, -0.29661595821380615, -0.2200426459312439,
			-0.22655129432678223, 0.29661595821380615, -0.0857098177075386, -0.19306239485740662,
			0.342725932598114, 0.24052657186985016, -0.1930624544620514, 0.342725932598114,
			-0.7418392300605774, -0.32417476177215576, -0.1427539885044098, -0.7418392300605774,
			-0.32417476177215576, 0.1427539885044098, -0.7418392300605774, -0.22655117511749268,
			0.16900058090686798, -0.7418392300605774, -0.22655117511749268, -0.16900058090686798,
		];
		let objEdges = [
			13, 3, 3, 1, 14, 0, 0, 2, 24, 1, 25, 2, 5, 4, 28, 4, 1, 4, 5, 3, 7, 6, 5, 7, 6, 3, 16, 8, 8,
			9, 0, 8, 2, 9, 12, 10, 10, 17, 22, 11, 20, 12, 10, 21, 11, 19, 18, 12, 12, 11, 13, 2, 14, 1,
			15, 9, 3, 21, 19, 8, 9, 22, 16, 18, 15, 21, 20, 15, 14, 16, 32, 13, 13, 15, 21, 17, 18, 17,
			20, 21, 20, 22, 19, 22, 18, 19, 17, 1, 16, 17, 23, 3, 26, 0, 27, 5, 29, 6, 30, 7, 31, 14, 24,
			28, 2, 36, 24, 31, 23, 32, 27, 28, 30, 27, 29, 30, 23, 29, 31, 26, 32, 25, 33, 32, 23, 34, 34,
			33, 35, 36, 37, 36, 38, 35, 37, 38, 37, 25, 35, 0, 26, 38, 52, 42, 42, 40, 53, 39, 39, 41, 63,
			40, 64, 41, 44, 43, 67, 43, 40, 43, 44, 42, 46, 45, 44, 46, 45, 42, 55, 47, 47, 48, 39, 47,
			41, 48, 51, 49, 49, 56, 61, 50, 59, 51, 49, 60, 50, 58, 57, 51, 51, 50, 52, 41, 53, 40, 54,
			48, 42, 60, 58, 47, 48, 61, 55, 57, 54, 60, 59, 54, 53, 55, 71, 52, 52, 54, 60, 56, 57, 56,
			59, 60, 59, 61, 58, 61, 57, 58, 56, 40, 55, 56, 62, 42, 65, 39, 66, 44, 68, 45, 69, 46, 70,
			53, 63, 67, 41, 75, 63, 70, 62, 71, 66, 67, 69, 66, 68, 69, 62, 68, 70, 65, 71, 64, 72, 71,
			62, 73, 73, 72, 74, 75, 76, 75, 77, 74, 76, 77, 76, 64, 74, 39, 65, 77, 37, 76, 25, 64, 32,
			71, 33, 72, 34, 73, 23, 62, 29, 68, 30, 69, 27, 66, 28, 67, 24, 63, 31, 70, 26, 65, 38, 77,
		];
		let tmpc = 0;
		for (let i = 0; i < objVerts.length; i += 3) {
			this.ply.mesh.verts[tmpc] = new Vert(
				objVerts[i] * this.scale,
				objVerts[i + 1] * this.scale,
				objVerts[i + 2] * this.scale,
			);
			tmpc++;
		}
		tmpc = 0;
		for (let i = 0; i < objEdges.length; i += 2) {
			this.ply.mesh.edges[tmpc] = new Edge(objEdges[i], objEdges[i + 1]);
			tmpc++;
		}

		this.tmpPort.addObj(this.ply);
	}

	bindListeners() {
		this.canvas.addEventListener('mouseenter', () => {
			this.start();
		});

		this.canvas.addEventListener('mouseleave', () => {
			this.stop();
		});

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
		this.curCnt++;
		if (this.curCnt > 100) {
			let difX = this.ply.pos.x - (this.tmpPort.cam.pos.x + 200);
			let difY = this.ply.pos.y - this.tmpPort.cam.pos.y;
			let difZ = this.ply.pos.z - this.tmpPort.cam.pos.z;
			this.tmpPort.cam.pos.x += difX / 10;
			this.tmpPort.cam.pos.y += difY / 10;
			this.tmpPort.cam.pos.z += difZ / 10;
			if (difX < 0.1 && difX > -0.1) {
				this.isStarted = true;
				console.log('Start');
			}
			//ang
			difX = 1.57 - this.tmpPort.cam.ang.x;
			difY = 0 - this.tmpPort.cam.ang.y;
			difZ = -1.6 - this.tmpPort.cam.ang.z;
			this.tmpPort.cam.ang.x += difX / 20;
			this.tmpPort.cam.ang.y += difY / 20;
			this.tmpPort.cam.ang.z += difZ / 20;
			this.tmpPort.cam.updateDir();
		}
	}

	setMove() {
		let xTrue = 0;
		let yTrue = 0;

		for (let y = 0; y < this.square; y++) {
			for (let x = 0; x < this.square; x++) {
				if (y % 2 != x % 2) {
					const i = y * this.square + x;
					const x1 = (x + this.curWave) % this.square;
					const y1 = y;
					if (x != this.square - 1) {
						xTrue = (x1 + 1) % this.square;
					} else {
						xTrue = x1;
					}
					yTrue = (y1 + 1) % this.square;

					if (this.tmpPort.objects[i]) {
						this.tmpPort.objects[i].mesh.verts[0] = new Vert(0, 0, this.display[x1][y1]);
						this.tmpPort.objects[i].mesh.verts[3] = new Vert(
							this.scale,
							0,
							this.display[xTrue][y1],
						);

						this.tmpPort.objects[i].mesh.verts[1] = new Vert(
							0,
							this.scale,
							this.display[x1][yTrue],
						);
						this.tmpPort.objects[i].mesh.verts[2] = new Vert(
							this.scale,
							this.scale,
							this.display[xTrue][yTrue],
						);
					}
				}
			}
		}
		//check for colors and whatnot
		let curKick = 0;
		let tmp = 6;
		for (let i = 0; i < tmp; i++) {
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
		tmp = RGBtoHSV(r, g, b);
		this.curHue += (tmp.h - this.curHue) * 0.05;
		tmp = HSVtoRGB(this.curHue, 1 - this.colCur, 0.8);

		this.curCol =
			'rgb(' + Math.round(tmp.r) + ',' + Math.round(tmp.g) + ',' + Math.round(tmp.b) + ')';
	}

	editHeight(inVal) {
		return Math.pow(inVal / 30, 5) / 8;
	}

	getAudioData() {
		this.curWave++;
		this.curWave = this.curWave % this.square;
		const fbc_array = new Uint8Array(this.analyser.frequencyBinCount);
		this.analyser.getByteFrequencyData(fbc_array);
		const bars = this.square + 1;

		const bar_width = 2;
		let audioVolume = 0.8 + 0.2 * this.audio.volume;
		for (let i = 1; i < bars - 1; i++) {
			const bar_x = this.square * 3 - i * 3;
			const bar_height = fbc_array[i] / 2 / audioVolume;
			this.display[this.curWave][i] = this.editHeight(bar_height);
			this.ctx.fillRect(bar_x, 50, bar_width, -this.display[this.curWave][i] / 3);
		}
	}

	getDisp(inX, inY) {
		const tmpx = (inX + this.curWave) % this.square;
		if (tmpx < 0 || tmpx >= this.square) {
			return 0;
		}
		if (inY < 0 || inY >= this.square) {
			return 0;
		}
		return this.display[tmpx][inY];
	}

	getHeight(x, y) {
		const curX = Math.floor(x);
		const curY = Math.floor(y);
		const rellX = x - curX;
		const rellY = y - curY;

		const pnt1 =
			(this.getDisp(curX, curY + 1) - this.getDisp(curX, curY)) * rellY + this.getDisp(curX, curY);
		const pnt2 =
			(this.getDisp(curX + 1, curY + 1) - this.getDisp(curX + 1, curY)) * rellY +
			this.getDisp(curX + 1, curY);
		return (pnt2 - pnt1) * rellX + pnt1;
	}

	getThrustF(height) {
		const dif = this.thrustHeight - (this.ply.pos.z - height);
		return dif;
	}

	getPlyPos() {
		if (this.ply.pos.x < 15 * this.scale) {
			this.ply.pos.x += (15 * this.scale - this.ply.pos.x) / 10 + 0.3;
		}
		this.ply.curForce.y += this.right * 50;
		if (this.right == 0) {
			this.ply.vel.y = this.ply.vel.y * 0.9;
		}
		//get the current floorPos
		if (this.ply.pos.y < this.scale) {
			this.ply.pos.y = this.scale;
		}
		if (this.ply.pos.y > this.scale * this.square) {
			this.ply.pos.y = this.scale * this.square;
		}
		const relX = this.ply.pos.x / this.scale;
		const relY = this.ply.pos.y / this.scale;

		const F = this.getHeight(relX + 1, relY);
		const B = this.getHeight(relX - 1, relY);
		const L = this.getHeight(relX, relY + 1);
		const R = this.getHeight(relX, relY - 1);
		const curHeight = (F + B + L + R) / 4;

		if (curHeight + this.thrustHeight * 1.5 > this.ply.pos.z) {
			this.ply.ang.x +=
				clamp(Math.atan((L - R) / (this.scale * 2)) - this.ply.ang.x, -0.5, 0.5) * 0.3;
			this.ply.ang.y +=
				clamp(Math.atan((B - F) / (this.scale * 2)) - this.ply.ang.y, -0.5, 0.5) * 0.3;
		} else {
			this.ply.ang.x += -(clamp(this.ply.ang.x, -1, 1) * 0.1);
			this.ply.ang.y += -(clamp(this.ply.ang.y, -1, 1) * 0.1);
		}
		if (curHeight + this.thrustHeight > this.ply.pos.z) {
			let velUp = curHeight + this.thrustHeight - this.ply.pos.z;
			if (velUp > 8) {
				velUp = 8;
			}
			if (velUp > this.ply.vel.z) {
				this.ply.vel.z = velUp;
			} else {
				this.ply.vel.z -= velUp;
			}
		}
		this.ply.updateDir();
		this.ply.physTick(0.03);
		if (this.ply.pos.y < 2 * this.scale) {
			this.ply.pos.y = 2 * this.scale;
			if (this.ply.vel.y < 0) {
				this.ply.vel.y = 0;
			}
		} else if (this.ply.pos.y > (this.square - 2) * this.scale) {
			this.ply.pos.y = (this.square - 2) * this.scale;
			if (this.ply.vel.y > 0) {
				this.ply.vel.y = 0;
			}
		}
		let tmpAng = Math.atan(
			(this.ply.pos.x - this.tmpPort.cam.pos.x) / -(this.ply.pos.z - this.tmpPort.cam.pos.z),
		);
		if (tmpAng < 0) {
			tmpAng = Math.PI + tmpAng;
		}
		this.tmpPort.cam.ang.x = tmpAng;
		this.tmpPort.cam.pos.y = this.ply.pos.y;
		this.tmpPort.cam.updateDir();
	}

	draw() {
		if (!this.isStarted) {
			this.camPos();
		} else {
			this.getPlyPos();
		}
		this.ctx.fillStyle = 'rgb(0,0,0)';
		this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

		this.setMove();
		this.ctx.strokeStyle = this.curCol;
		this.tmpPort.draw();
		this.ctx.beginPath();
		this.ctx.strokeStyle = 'rgb(100,255,255)';
		this.ply.shader(this.tmpPort.cam);
		this.ctx.stroke();
		this.ctx.fillStyle = 'rgb(255,0,0)';
		for (let i = 0; i < this.moveSpeed; i++) {
			this.getAudioData();
		}
	}

	initMp3Player() {
		const context = new AudioContext();
		const source = context.createMediaElementSource(this.audio);
		this.analyser = context.createAnalyser();
		source.connect(this.analyser);
		this.analyser.connect(context.destination);
	}
}
