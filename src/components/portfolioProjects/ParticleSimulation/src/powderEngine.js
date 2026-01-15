//some simple dataTypes
export class rect {
	constructor(inX, inY, inW, inH) {
		this.x = inX;
		this.y = inY;
		this.w = inW;
		this.h = inH;
	}
}

export class vec2 {
	constructor(inX, inY) {
		this.x = inX;
		this.y = inY;
	}
}

//some simple functions
export const max = function (inx, iny) {
	if (inx < iny) {
		return iny;
	}
	return inx;
};
export const min = function (inx, iny) {
	if (inx > iny) {
		return iny;
	}
	return inx;
};
export const dist = function (vec1, vec2) {
	const x = vec1.x - vec2.x;
	const y = vec1.y - vec2.y;
	return Math.sqrt(x * x + y * y);
};
export const toPort = function (inVec2) {
	const outx = Math.round(inVec2.x);
	const outy = Math.round(inVec2.y);
	return { x: outx, y: outy };
};
export const toDisp = function (inVec2, pixelSize) {
	const outx = Math.round(inVec2.x * pixelSize.w);
	const outy = Math.round(inVec2.y * pixelSize.h);
	return { x: outx, y: outy };
};

export class node {
	constructor(inPos, inOwner, inCont) {
		this.cont = inCont;
		this.owner = inOwner;
		this.col = 'rgb(0,255,255)';
		//physics
		this.pos = inPos;
		this.editPos = { x: 0, y: 0 };
		this.vel = { x: 0, y: 0 };
		this.curForce = { x: 0, y: 0 };
		this.grav = { x: 0, y: 0.005 };
		this.mass = 1;
		this.airFric = 1;
		this.restitution = 0;
		this.isStatic = false;
		//drawing
		this.lastPos = { x: 0, y: 0 };

		this.updateLasPos();
	}

	updateLasPos = function () {
		this.lastPos = { x: this.pos.x, y: this.pos.y };
	};

	dirTo = function (pnt1, pnt2) {
		let x = pnt1.pos.x - pnt2.pos.x;
		let y = pnt1.pos.y - pnt2.pos.y;
		let dist = Math.sqrt(x * x + y * y);
		if (dist > 0) {
			return { d: dist, x: x / dist, y: y / dist };
		} else {
			x = Math.random() - 0.5;
			y = Math.random() - 0.5;
			dist = Math.sqrt(x * x + y * y);
			return { d: dist, x: x / dist, y: y / dist };
		}
	};

	forceFromPoint = function (pnt1, pnt2) {
		let totPntForce = { x: 0, y: 0 };
		if (pnt1 != pnt2) {
			let dir = this.dirTo(pnt1, pnt2);
			if (dir.d < 1) {
				if (!pnt2.isStatic) {
					const dx = pnt1.pos.x - pnt2.pos.x;
					const dy = pnt1.pos.y - pnt2.pos.y;
					const collisionision_angle = Math.atan2(dy, dx);
					const magnitude_1 = Math.sqrt(pnt1.vel.x * pnt1.vel.x + pnt1.vel.y * pnt1.vel.y);
					const magnitude_2 = Math.sqrt(pnt2.vel.x * pnt2.vel.x + pnt2.vel.y * pnt2.vel.y);
					const direction_1 = Math.atan2(pnt1.vel.y, pnt1.vel.x);
					const direction_2 = Math.atan2(pnt2.vel.y, pnt2.vel.x);
					const new_xspeed_1 = magnitude_1 * Math.cos(direction_1 - collisionision_angle);
					const new_yspeed_1 = magnitude_1 * Math.sin(direction_1 - collisionision_angle);
					const new_xspeed_2 = magnitude_2 * Math.cos(direction_2 - collisionision_angle);

					const final_xspeed_1 =
						(this.restitution * pnt2.mass * (new_xspeed_2 - new_xspeed_1) +
							pnt1.mass * new_xspeed_1 +
							pnt2.mass * new_xspeed_2) /
						(pnt1.mass + pnt2.mass);

					const final_yspeed_1 = new_yspeed_1;
					totPntForce.x =
						(Math.cos(collisionision_angle) * final_xspeed_1 +
							Math.cos(collisionision_angle + Math.PI / 2) * final_yspeed_1 -
							pnt1.vel.x) *
						pnt1.mass;
					totPntForce.y =
						(Math.sin(collisionision_angle) * final_xspeed_1 +
							Math.sin(collisionision_angle + Math.PI / 2) * final_yspeed_1 -
							pnt1.vel.y) *
						pnt1.mass;
				}
				this.editPos.x = pnt2.pos.x + dir.x - pnt1.pos.x;
				this.editPos.y = pnt2.pos.y + dir.y - pnt1.pos.y;
			}
		}
		return totPntForce;
	};
	forceFromCell = function (node, cell) {
		let totCellForce = { x: 0, y: 0 };
		let tmpCellForce;
		for (let i = 0; i < cell.length; i++) {
			tmpCellForce = this.forceFromPoint(node, cell[i]);
			totCellForce.x += tmpCellForce.x;
			totCellForce.y += tmpCellForce.y;
		}
		return totCellForce;
	};

	calcForce = function (curNode) {
		const totForce = { x: 0, y: 0 };
		let curCell = toPort(curNode.pos);
		let tmpForce;
		if (
			curCell.x >= 0 &&
			curCell.x < this.owner.bounds.w &&
			curCell.y >= 0 &&
			curCell.y < this.owner.bounds.h
		) {
			//cur
			tmpForce = this.forceFromCell(curNode, this.owner.wMatrix[curCell.x][curCell.y]);
			totForce.x += tmpForce.x;
			totForce.y += tmpForce.y;
			//top
			if (curCell.y + 1 < this.owner.bounds.h) {
				tmpForce = this.forceFromCell(curNode, this.owner.wMatrix[curCell.x][curCell.y + 1]);
				totForce.x += tmpForce.x;
				totForce.y += tmpForce.y;
			}
			//bot
			if (curCell.y - 1 >= 0) {
				tmpForce = this.forceFromCell(curNode, this.owner.wMatrix[curCell.x][curCell.y - 1]);
				totForce.x += tmpForce.x;
				totForce.y += tmpForce.y;
			}
			//left
			if (curCell.x - 1 >= 0) {
				tmpForce = this.forceFromCell(curNode, this.owner.wMatrix[curCell.x - 1][curCell.y]);
				totForce.x += tmpForce.x;
				totForce.y += tmpForce.y;
			}
			//right
			if (curCell.x + 1 < this.owner.bounds.w) {
				tmpForce = this.forceFromCell(curNode, this.owner.wMatrix[curCell.x + 1][curCell.y]);
				totForce.x += tmpForce.x;
				totForce.y += tmpForce.y;
			}
		} else {
			console.log('This should never run');
		}
		return totForce;
	};

	physTick = function () {
		//do basic math to update the velocity
		let accel = {
			x: this.curForce.x / this.mass,
			y: this.curForce.y / this.mass,
		};
		this.vel.x += accel.x;
		this.vel.y += accel.y;
		//reset the force
		this.curForce.x = 0;
		this.curForce.y = 0;
	};
	moveTick = function () {
		//remove from the world matrix
		let curPos = toPort(this.pos);
		if (
			curPos.x >= 0 &&
			curPos.x < this.owner.bounds.w &&
			curPos.y > 0 &&
			curPos.y < this.owner.bounds.h
		) {
			const tmpIndex = this.owner.wMatrix[curPos.x][curPos.y].indexOf(this);
			if (tmpIndex != -1) {
				this.owner.wMatrix[Math.round(curPos.x)][Math.round(curPos.y)].splice(tmpIndex, 1);
			}
		} else {
			console.log('THIS SHOULD NEVER RUN! 1');
			this.owner.remNode(this);
			return;
		}
		this.vel.x = this.vel.x * this.airFric;
		this.vel.y = this.vel.y * this.airFric;
		this.pos.x += this.vel.x + this.editPos.x;
		this.pos.y += this.vel.y + this.editPos.y;
		this.editPos = { x: 0, y: 0 };
		//add it the current cell
		curPos = toPort(this.pos);
		if (
			curPos.x >= 0 &&
			curPos.x < this.owner.bounds.w &&
			curPos.y > 0 &&
			curPos.y < this.owner.bounds.h
		) {
			this.owner.wMatrix[curPos.x][curPos.y].push(this);
		} else {
			this.owner.remNode(this);
		}
	};
	colTick = function () {
		//calc the phys for next tick
		this.curForce.x += this.grav.x;
		this.curForce.y += this.grav.y;
		const addForce = this.calcForce(this);
		this.curForce.x += addForce.x;
		this.curForce.y += addForce.y;
	};
}

export class port {
	constructor(ctx, inRect, inWidth, inHeight) {
		this.ctx = ctx;
		this.bounds = inRect;
		this.pixelSize = { w: inWidth, h: inHeight };
		this.maxDraw = 20000;

		this.static_nodes = [];
		this.dynamic_nodes = [];
		this.clearQueue = [];
		this.drawQueue = [];
		this.wMatrix = [];
		this.drawCol = 'rgb(255,100,255)';

		this.setDisp(inRect, inWidth, inHeight);
	}

	setDisp(inRect, inWidth, inHeight) {
		this.bounds = inRect;
		this.pixelSize = { w: inWidth, h: inHeight };
		for (let x = 0; x < inRect.w; x++) {
			this.wMatrix[x] = [];
			for (let y = 0; y < inRect.h; y++) {
				this.wMatrix[x][y] = [];
			}
		}
	}

	addNode(inPos, isStatic, inCont) {
		const curPos = toPort(inPos);
		if (curPos.x >= 0 && curPos.x < this.bounds.w && curPos.y >= 0 && curPos.y < this.bounds.h) {
			const addNode = new node(inPos, this, inCont);
			addNode.isStatic = isStatic;
			if (isStatic) {
				this.static_nodes.push(addNode);
				this.drawQueue.push({ pos: toDisp(inPos, this.pixelSize), col: 'rgb(0,255,255)' });
			} else {
				this.dynamic_nodes.push(addNode);
			}
			this.wMatrix[curPos.x][curPos.y].push(addNode);
			return addNode;
		}
	}

	remNode(inNode) {
		let tmpIndex = this.static_nodes.indexOf(inNode);
		if (tmpIndex != -1) {
			this.static_nodes.splice(tmpIndex, 1);
		}
		tmpIndex = this.dynamic_nodes.indexOf(inNode);
		if (tmpIndex != -1) {
			this.dynamic_nodes.splice(tmpIndex, 1);
		}
		this.clearQueue.push({ pos: toDisp(inNode.lastPos, this.pixelSize) });
	}

	tick() {
		//check collisions
		for (let i = 0; i < this.dynamic_nodes.length; i++) {
			this.dynamic_nodes[i].colTick();
		}
		//get the forces
		for (let i = 0; i < this.dynamic_nodes.length; i++) {
			this.dynamic_nodes[i].physTick();
		}
		//move the nodes
		for (let i = 0; i < this.dynamic_nodes.length; i++) {
			this.dynamic_nodes[i].moveTick();
		}
	}

	clearDraw() {
		this.ctx.lineWidth = 3;
		let cur;
		let tmpLen = min(this.clearQueue.length, this.maxDraw);
		this.ctx.beginPath();

		const radius = this.pixelSize.w / 2;
		for (let i = 0; i < tmpLen; i++) {
			cur = this.clearQueue.shift();
			this.ctx.moveTo(cur.pos.x + radius, cur.pos.y);
			this.ctx.arc(cur.pos.x, cur.pos.y, radius, 0, 2 * Math.PI);
		}
		this.ctx.strokeStyle = 'rgb(0,0,0)';
		this.ctx.stroke();
	}

	showDraw() {
		this.ctx.lineWidth = 1;
		let cur;
		let tmpLen = min(this.drawQueue.length, this.maxDraw);
		this.ctx.beginPath();
		this.ctx.strokeStyle = this.drawCol;
		const radius = this.pixelSize.w / 2;
		for (let i = 0; i < tmpLen; i++) {
			cur = this.drawQueue.shift();

			this.ctx.moveTo(cur.pos.x + radius, cur.pos.y);
			this.ctx.arc(cur.pos.x, cur.pos.y, radius, 0, 2 * Math.PI);
		}
		this.ctx.stroke();
	}

	draw() {
		//decide the draw positions
		for (let i = 0; i < this.dynamic_nodes.length; i++) {
			const tmpPos1 = toDisp(this.dynamic_nodes[i].lastPos, this.pixelSize);
			const tmpPos2 = toDisp(this.dynamic_nodes[i].pos, this.pixelSize);
			this.clearQueue.push({ pos: tmpPos1 });
			this.dynamic_nodes[i].updateLasPos();
			this.drawQueue.push({ pos: tmpPos2, col: this.dynamic_nodes[i].col });
		}
		this.clearDraw();
		this.showDraw();
	}
}
