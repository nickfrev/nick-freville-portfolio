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

export class Instance {
	constructor() {
		this.visible = true;
		this.isCulled = true;
		this.exists = true;

		this.pos = new Vec3(0, 0, 0);
		this.ang = new Vec3(0, 0, 0);

		this.forward = new Vec3(0, 1, 0);
		this.right = new Vec3(1, 0, 0);
		this.up = new Vec3(0, 0, 1);

		this.mesh = new Mesh();
	}
	updateDir() {
		this.up.x = Math.sin(this.ang.z) * Math.sin(this.ang.x);
		this.up.y = -(Math.cos(this.ang.z) * Math.sin(this.ang.x));
		this.up.z = Math.cos(this.ang.x);

		this.right.x = -(Math.cos(this.ang.z) * Math.cos(this.ang.y));
		this.right.y = -(Math.sin(this.ang.z) * Math.cos(this.ang.y));
		this.right.z = Math.sin(this.ang.y);
	}
}

export class Port {
	constructor(canvas) {
		this.canvas = canvas;
		this.ctx = this.canvas.getContext('2d');
		this.maxObjs = 5000;
		this.cam = new Instance();
		this.objects = new Array(this.maxObjs);
		//set up the objects array
		for (var i = 0; i < this.maxObjs; i++) {
			this.objects[i] = new Instance();
			this.objects[i].exists = false;
		}
	}

	addObj(inObj) {
		for (var i = 0; i < this.maxObjs; i++) {
			if (!this.objects[i].exists) {
				this.objects[i] = inObj;
				break;
			}
		}
	}

	draw() {
		this.ctx.beginPath();
		for (var i = 0; i < this.maxObjs; i++) {
			if (this.objects[i].exists && this.objects[i].visible) {
				this.shader(this.objects[i].mesh, this.objects[i].pos, i == 0);
			}
		}
		this.ctx.stroke();
	}

	shader(inMesh, inPos) {
		//print the verts
		this.ctx.strokeStyle = 'rgb(100,255,255)';
		inMesh.isCulled = true;
		for (var p = 0; p < inMesh.verts.length; p++) {
			const curPos = {
				x: inPos.x + inMesh.verts[p].pos.x,
				y: inPos.y + inMesh.verts[p].pos.y,
				z: inPos.z + inMesh.verts[p].pos.z,
			};
			const tmp = {
				x: curPos.x - this.cam.pos.x,
				y: curPos.y - this.cam.pos.y,
				z: curPos.z - this.cam.pos.z,
			};
			if (dotAng(tmp, this.cam.up) > 1.5708) {
				//half of pi btw

				const curProj = getProj(curPos, this.cam.pos, this.cam.ang, { x: 0, y: 0, z: 800 });
				inMesh.verts[p].drawx = this.canvas.width / 2 - curProj.x;
				inMesh.verts[p].drawy = curProj.y + this.canvas.height / 2;
				if (!isNaN(curProj.x) && !isNaN(curProj.x)) {
					const offsettmp = 0;
					if (
						inMesh.verts[p].drawx >= offsettmp &&
						inMesh.verts[p].drawx < this.canvas.width - offsettmp &&
						inMesh.verts[p].drawy >= offsettmp &&
						inMesh.verts[p].drawy < this.canvas.height - offsettmp
					) {
						inMesh.isCulled = false;
						inMesh.verts[p].isVisible = true;
					} else {
						inMesh.verts[p].isVisible = false;
					}
				}
			}
		}
		this.ctx.strokeStyle = 'rgb(100,100,255)';
		//print the edges

		for (var p = 0; p < inMesh.edges.length; p++) {
			const vert1 = inMesh.verts[inMesh.edges[p].left];
			const vert2 = inMesh.verts[inMesh.edges[p].right];
			if (!inMesh.isCulled) {
				this.ctx.moveTo(vert1.drawx, vert1.drawy);
				this.ctx.lineTo(vert2.drawx, vert2.drawy);
			}
		}
	}
}

export function mag(inVec) {
	return Math.sqrt(inVec.x * inVec.x + inVec.y * inVec.y + inVec.z * inVec.z);
}

export function dotAng(inVec1, inVec2) {
	if (mag(inVec1) * mag(inVec2) == 0) {
		return 2;
	}
	return Math.acos(
		(inVec1.x * inVec2.x + inVec1.y * inVec2.y + inVec1.z * inVec2.z) / (mag(inVec1) * mag(inVec2)),
	);
}

//not needed but too useful to not make standard
export function getProj(inPoint, inCamPos, inCamAng, inViewPos) {
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
