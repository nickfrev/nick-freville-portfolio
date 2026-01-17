export class Vec3 {
	constructor(inx, iny, inz) {
		this.x = inx;
		this.y = iny;
		this.z = inz;
	}
}

export class Vert {
	constructor(inx, iny, inz) {
		this.pos = new Vec3(inx, iny, inz);
		this.parPos = new Vec3(inx, iny, inz); //parent position
		this.drawx = 0;
		this.drawy = 0;
		this.isVisible = false;
	}
}

export class Edge {
	constructor(inLeft, inRight) {
		this.left = inLeft;
		this.right = inRight;
	}
}

export class Mesh {
	constructor() {
		this.verts = [];
		this.edges = [];
	}
}

function rotate(inVec, axis, angle) {
	if (axis == 0) {
		return {
			x: inVec.x,
			y: inVec.y * Math.cos(angle) - inVec.z * Math.sin(angle),
			z: inVec.z * Math.cos(angle) + inVec.y * Math.sin(angle),
		};
	}
	if (axis == 1) {
		return {
			x: inVec.x * Math.cos(angle) + inVec.z * Math.sin(angle),
			y: inVec.y,
			z: inVec.z * Math.cos(angle) - inVec.x * Math.sin(angle),
		};
	}
	if (axis == 2) {
		return {
			x: inVec.x * Math.cos(angle) - inVec.y * Math.sin(angle),
			y: inVec.y * Math.cos(angle) + inVec.x * Math.sin(angle),
			z: inVec.z,
		};
	}
}

function mag(inVec) {
	return Math.sqrt(inVec.x * inVec.x + inVec.y * inVec.y + inVec.z * inVec.z);
}

function dotAng(inVec1, inVec2) {
	if (mag(inVec1) * mag(inVec2) == 0) {
		return 2;
	}
	return Math.acos(
		(inVec1.x * inVec2.x + inVec1.y * inVec2.y + inVec1.z * inVec2.z) / (mag(inVec1) * mag(inVec2)),
	);
}

//not needed but too useful to not make standard
function getProj(inPoint, inCamPos, inCamAng, inViewPos) {
	//thanks wikipedia made it uber easy
	const dif = {
		x: inPoint.x - inCamPos.x,
		y: inPoint.y - inCamPos.y,
		z: inPoint.z - inCamPos.z,
	};
	const s = {
		x: Math.sin(inCamAng.x),
		y: Math.sin(inCamAng.y),
		z: Math.sin(inCamAng.z),
	};
	const c = {
		x: Math.cos(inCamAng.x),
		y: Math.cos(inCamAng.y),
		z: Math.cos(inCamAng.z),
	};
	//for compression
	const tmp1 = s.z * dif.y + c.z * dif.x;
	const tmp2 = c.y * dif.z + s.y * tmp1;
	const tmp3 = c.z * dif.y - s.z * dif.x;
	const d = {
		x: c.y * tmp1 - s.y * dif.z,
		y: s.x * tmp2 + c.x * tmp3,
		z: c.x * tmp2 - s.x * tmp3,
	};
	const b = {
		x: (inViewPos.z / d.z) * d.x - inViewPos.x,
		y: (inViewPos.z / d.z) * d.y - inViewPos.y,
	};
	return b;
}

export class Instance {
	constructor() {
		this.canvas = null;
		this.ctx = null;
		this.mesh = new Mesh();
		this.visible = true;
		this.isCulled = true;
		this.exists = true;

		this.pos = new Vec3(0, 0, 0);
		this.ang = new Vec3(0, 0, 0);

		this.forward = new Vec3(0, 1, 0);
		this.right = new Vec3(1, 0, 0);
		this.up = new Vec3(0, 0, 1);

		//physics
		this.vel = new Vec3(0, 0, 0);
		this.angVel = new Vec3(0, 0, 0);
		this.curForce = new Vec3(0, 0, 0);
		this.curTorque = new Vec3(0, 0, 0);

		this.gravity = new Vec3(0, 0, -120); //in pixels ;)
		this.airFric = 0.95;
		this.mass = 10;
	}

	updateDir() {
		this.up.x = Math.sin(this.ang.z) * Math.sin(this.ang.x);
		this.up.y = -(Math.cos(this.ang.z) * Math.sin(this.ang.x));
		this.up.z = Math.cos(this.ang.x);

		this.right.x = -(Math.cos(this.ang.z) * Math.cos(this.ang.y));
		this.right.y = -(Math.sin(this.ang.z) * Math.cos(this.ang.y));
		this.right.z = Math.sin(this.ang.y);
		//change the model angle
		for (var p = 0; p < this.mesh.verts.length; p++) {
			this.mesh.verts[p].pos = rotate(this.mesh.verts[p].parPos, 0, this.ang.x);
			this.mesh.verts[p].pos = rotate(this.mesh.verts[p].pos, 1, this.ang.y);
			this.mesh.verts[p].pos = rotate(this.mesh.verts[p].pos, 2, this.ang.z);
		}
	}

	shader(cam) {
		//print the verts
		this.isCulled = true;
		for (var p = 0; p < this.mesh.verts.length; p++) {
			const curPos = {
				x: this.pos.x + this.mesh.verts[p].pos.x,
				y: this.pos.y + this.mesh.verts[p].pos.y,
				z: this.pos.z + this.mesh.verts[p].pos.z,
			};
			const tmp = {
				x: curPos.x - cam.pos.x,
				y: curPos.y - cam.pos.y,
				z: curPos.z - cam.pos.z,
			};
			if (dotAng(tmp, cam.up) > 1.5708) {
				//half of pi btw

				const curProj = getProj(curPos, cam.pos, cam.ang, { x: 0, y: 0, z: 800 });
				this.mesh.verts[p].drawx = this.canvas.width / 2 - curProj.x;
				this.mesh.verts[p].drawy = curProj.y + this.canvas.height / 2;
				if (!isNaN(curProj.x) && !isNaN(curProj.x)) {
					if (
						this.mesh.verts[p].drawx >= 0 &&
						this.mesh.verts[p].drawx < this.canvas.width &&
						this.mesh.verts[p].drawy >= 0 &&
						this.mesh.verts[p].drawy < this.canvas.height
					) {
						this.isCulled = false;
					}
				}
			}
		}
		//print the edges

		for (var p = 0; p < this.mesh.edges.length; p++) {
			const vert1 = this.mesh.verts[this.mesh.edges[p].left];
			const vert2 = this.mesh.verts[this.mesh.edges[p].right];
			if (!this.isCulled) {
				this.ctx.moveTo(vert1.drawx, vert1.drawy);
				this.ctx.lineTo(vert2.drawx, vert2.drawy);
			}
		}
	}

	physTick(dt) {
		this.curForce.x += this.gravity.x;
		this.curForce.y += this.gravity.y;
		this.curForce.z += this.gravity.z;
		const a = new Vec3(
			this.curForce.x / this.mass,
			this.curForce.y / this.mass,
			this.curForce.z / this.mass,
		);
		this.curForce = new Vec3(0, 0, 0);
		this.vel.x += a.x * dt;
		this.vel.y += a.y * dt;
		this.vel.z += a.z * dt;
		this.pos.x += this.vel.x;
		this.pos.y += this.vel.y;
		this.pos.z += this.vel.z;
		this.vel.x = this.vel.x * this.airFric;

		this.angVel.x += this.curTorque.x;
		this.angVel.y += this.curTorque.y;
		this.angVel.z += this.curTorque.z;
		this.curTorque = new Vec3(0, 0, 0);

		this.ang.x += this.angVel.x;
		this.ang.y += this.angVel.y;
		this.ang.z += this.angVel.z;
		this.updateDir();
	}

	applyOffset(inForce, inPos, isWorld) {
		this.curForce.x += inForce.x;
		this.curForce.y += inForce.y;
		this.curForce.z += inForce.z;
		//angVelocity
		if (isWorld) {
			var r = new Vec3(inPos.x - this.pos.x, inPos.y - this.pos.y, inPos.z - this.pos.z);
		} else {
			var r = inPos;
		}
		this.curTorque.x += ((r.y * inForce.z - r.z * inForce.y) / this.mass) * 0.01745;
		this.curTorque.y += ((r.z * inForce.x - r.x * inForce.z) / this.mass) * 0.01745;
		this.curTorque.z += ((r.x * inForce.y - r.y * inForce.x) / this.mass) * 0.01745;
		//var curTor = new Vec3(r.y*inForce.z-r.z*inForce.y,
		//					  r.z*inForce.x-r.x*inForce.z,
		//					  r.x*inForce.y-r.y*inForce.x);
	}
}

export class Port {
	constructor(canvas) {
		this.canvas = canvas;
		this.ctx = this.canvas.getContext('2d');
		this.maxObjs = 15000;
		this.cam = new Instance();
		this.objects = new Array(this.maxObjs);
		for (var i = 0; i < this.maxObjs; i++) {
			this.objects[i] = new Instance();
			this.objects[i].exists = false;
		}
	}

	addObj(inObj) {
		for (var i = 0; i < this.maxObjs; i++) {
			if (!this.objects[i].exists) {
				inObj.canvas = this.canvas;
				inObj.ctx = this.ctx;
				this.objects[i] = inObj;
				break;
			}
		}
	}

	draw() {
		this.ctx.beginPath();
		for (var i = 0; i < this.maxObjs; i++) {
			if (this.objects[i].exists && this.objects[i].visible) {
				this.objects[i].shader(this.cam);
			}
		}
		this.ctx.stroke();
	}
}
