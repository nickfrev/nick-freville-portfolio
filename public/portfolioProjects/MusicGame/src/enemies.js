obj = function (inPos, inDir) {
	//base, now I could use inheritance but this is a throwaway code so I don't care
	this.hp = 1;
	this.dir = inDir || { x: 0, y: 1 };
	this.pos = inPos || { x: 0, y: 0 };
	this.myEng = null;
	this.alive = true;
	this.draw = function () {
		ctx.beginPath();
		ctx.fillStyle = '#FF00FF';
		ctx.arc(this.pos.x, this.pos.y, 15, 0, 2 * Math.PI);
		ctx.fill();
	};
	this.logic = function () {
		this.pos.x += 3;
	};
	this.onLive = function () {};
	this.onDeath = function () {};
	this.takeDamage = function (inDmg) {
		this.hp -= inDmg;
		if (this.hp <= 0) {
			this.onDeath();
		}
		this.alive = false;
	};
	this.isInBounds = function (width, height) {
		if (this.pos.x < 0 || this.pos.x > width) {
			return false;
		}
		if (this.pos.y < 0 || this.pos.y > height) {
			return false;
		}
		return true;
	};
};
//Grunt
grunt = function (inPos, inDir) {
	this.hp = 1;
	this.dir = inDir || { x: 0, y: 1 };
	this.pos = inPos || { x: 0, y: 0 };
	this.myEng = null;
	this.alive = true;
	this.draw = function () {
		ctx.beginPath();
		ctx.fillStyle = '#FF00FF';
		ctx.arc(this.pos.x, this.pos.y, 10, 0, 2 * Math.PI);
		ctx.fill();
	};
	this.logic = function () {
		this.pos.x += this.dir.x * 3;
		this.pos.y += this.dir.y * 3;
		//if (Math.random() < 0.001) {
		//	this.setDead();
		//}
		/*
		if (this.reload > 0) {this.reload -= 0.01;}
		if (this.reload <= 0) {
			this.reload += 1;
			var tmpDir = {x:this.dir.y,y:-this.dir.x};
			this.myEng.addObj(new grunt_pellet({x:this.pos.x+tmpDir.x,y:this.pos.y+tmpDir.y},{x:tmpDir.x,y:tmpDir.y}));
		}
		*/
	};
	this.onLive = function () {};
	this.setDead = function () {
		this.alive = false;
		this.onDeath();
	};
	this.onDeath = function () {
		//make a circle of pellets
		var cnt = 5;
		var piSlice = (Math.PI / cnt) * 2;
		var dist = 5;

		var tmpDir = { x: 0, y: 0 };
		for (var i = 0; i < cnt; i++) {
			tmpDir.x = Math.sin(piSlice * i);
			tmpDir.y = Math.cos(piSlice * i);
			this.myEng.addObj(
				new grunt_pellet(
					{ x: this.pos.x + tmpDir.x * dist, y: this.pos.y + tmpDir.y * dist },
					{ x: tmpDir.x, y: tmpDir.y },
				),
			);
		}
	};
	this.takeDamage = function (inDmg) {
		this.hp -= inDmg;
		if (this.hp <= 0) {
			this.onDeath();
		}
		this.alive = false;
	};
	this.isInBounds = function (width, height) {
		if (this.pos.x < 0 || this.pos.x > width) {
			return false;
		}
		if (this.pos.y < 0 || this.pos.y > height) {
			return false;
		}
		return true;
	};
};

grunt_pellet = function (inPos, inDir) {
	this.hp = 1;
	this.dir = inDir || { x: 0, y: 1 };
	this.pos = inPos || { x: 0, y: 0 };
	this.myEng = null;
	this.alive = true;
	this.draw = function () {
		ctx.beginPath();
		ctx.fillStyle = '#00FF00';
		ctx.arc(this.pos.x, this.pos.y, 5, 0, 2 * Math.PI);
		ctx.fill();
	};
	this.logic = function () {
		this.pos.x += this.dir.x * 5;
		this.pos.y += this.dir.y * 5;
	};
	this.onLive = function () {};
	this.setDead = function () {
		this.alive = false;
		this.onDeath();
	};
	this.onDeath = function () {};
	this.takeDamage = function (inDmg) {
		this.hp -= inDmg;
		if (this.hp <= 0) {
			this.onDeath();
		}
		this.alive = false;
	};
	this.isInBounds = function (width, height) {
		if (this.pos.x < 0 || this.pos.x > width) {
			return false;
		}
		if (this.pos.y < 0 || this.pos.y > height) {
			return false;
		}
		return true;
	};
};

//trishooter
triShooter = function (inPos, inDir) {
	this.hp = 2;
	this.dir = inDir || { x: 0, y: 1 };
	this.pos = inPos || { x: 0, y: 0 };
	this.myEng = null;
	this.alive = true;
	this.reload = 0;
	this.curRot = 0;
	this.draw = function () {
		ctx.beginPath();
		ctx.fillStyle = '#FF0000';
		ctx.arc(this.pos.x, this.pos.y, 10, 0, 2 * Math.PI);
		ctx.fill();
		ctx.beginPath();
		ctx.fillStyle = '#0000FF';
		ctx.arc(
			this.pos.x + Math.sin(this.curRot) * 10,
			this.pos.y + Math.cos(this.curRot) * 10,
			5,
			0,
			2 * Math.PI,
		);
		//ctx.arc(this.pos.x+Math.sin(this.curRot+Math.PI/1.5)*10,this.pos.y++Math.cos(this.curRot+Math.PI/1.5)*10,3,0,2*Math.PI);
		//ctx.arc(this.pos.x+Math.sin(this.curRot+Math.PI/0.75)*10,this.pos.y++Math.cos(this.curRot+Math.PI/0.75)*10,3,0,2*Math.PI);
		ctx.fill();
	};
	this.logic = function () {
		this.pos.x += this.dir.x * 5;
		this.pos.y += this.dir.y * 5;

		if (this.reload > 0) {
			this.reload -= 0.01;
		}
		if (this.reload <= 0) {
			this.reload += 0.5;
			var baseRot = Math.PI / 1.5;
			this.curRot += baseRot / 3;
			for (var i = 0; i < 3; i++) {
				var tmpDir = {
					x: Math.sin(baseRot * i + this.curRot),
					y: Math.cos(baseRot * i + this.curRot),
				};
				this.myEng.addObj(
					new grunt_pellet(
						{ x: this.pos.x + tmpDir.x, y: this.pos.y + tmpDir.y },
						{ x: tmpDir.x, y: tmpDir.y },
					),
				);
			}
		}
	};
	this.onLive = function () {};
	this.setDead = function () {
		this.alive = false;
		this.onDeath();
	};
	this.onDeath = function () {};
	this.takeDamage = function (inDmg) {
		this.hp -= inDmg;
		if (this.hp <= 0) {
			this.onDeath();
		}
		this.alive = false;
	};
	this.isInBounds = function (width, height) {
		if (this.pos.x < 0 || this.pos.x > width) {
			return false;
		}
		if (this.pos.y < 0 || this.pos.y > height) {
			return false;
		}
		return true;
	};
};

//spiralmaker
spiral = function (inPos, inDir) {
	this.hp = 2;
	this.dir = inDir || { x: 0, y: 1 };
	this.pos = inPos || { x: 0, y: 0 };
	this.myEng = null;
	this.alive = true;
	this.reload = 0;
	this.curRot = 0;
	this.draw = function () {
		ctx.beginPath();
		ctx.fillStyle = '#FF0000';
		ctx.arc(this.pos.x, this.pos.y, 10, 0, 2 * Math.PI);
		ctx.fill();
		ctx.beginPath();
		ctx.fillStyle = '#0000FF';
		ctx.arc(
			this.pos.x + Math.sin(this.curRot) * 10,
			this.pos.y + Math.cos(this.curRot) * 10,
			5,
			0,
			2 * Math.PI,
		);
		//ctx.arc(this.pos.x+Math.sin(this.curRot+Math.PI/1.5)*10,this.pos.y++Math.cos(this.curRot+Math.PI/1.5)*10,3,0,2*Math.PI);
		//ctx.arc(this.pos.x+Math.sin(this.curRot+Math.PI/0.75)*10,this.pos.y++Math.cos(this.curRot+Math.PI/0.75)*10,3,0,2*Math.PI);
		ctx.fill();
	};
	this.logic = function () {
		this.pos.x += this.dir.x * 2;
		this.pos.y += this.dir.y * 2;

		if (this.reload > 0) {
			this.reload -= 0.01;
		}
		if (this.reload <= 0) {
			this.reload += 0.5;
			var baseRot = Math.PI / 1.5;
			this.curRot += baseRot / 3;
			for (var i = 0; i < 3; i++) {
				var tmpDir = {
					x: Math.sin(baseRot * i + this.curRot),
					y: Math.cos(baseRot * i + this.curRot),
				};
				this.myEng.addObj(
					new spiral_pellet(
						{ x: this.pos.x + tmpDir.x, y: this.pos.y + tmpDir.y },
						{ x: tmpDir.x, y: tmpDir.y },
					),
				);
			}
		}
	};
	this.onLive = function () {};
	this.setDead = function () {
		this.alive = false;
	};
	this.onDeath = function () {};
	this.takeDamage = function (inDmg) {
		this.hp -= inDmg;
		if (this.hp <= 0) {
			this.onDeath();
		}
		this.alive = false;
	};
	this.isInBounds = function (width, height) {
		if (this.pos.x < 0 || this.pos.x > width) {
			return false;
		}
		if (this.pos.y < 0 || this.pos.y > height) {
			return false;
		}
		return true;
	};
};

spiral_pellet = function (inPos, inDir) {
	this.hp = 1;
	this.dir = inDir || { x: 0, y: 1 };
	this.pos = inPos || { x: 0, y: 0 };
	this.myEng = null;
	this.alive = true;
	this.draw = function () {
		ctx.beginPath();
		ctx.fillStyle = '#FFFF00';
		ctx.arc(this.pos.x, this.pos.y, 5, 0, 2 * Math.PI);
		ctx.fill();
	};
	this.logic = function () {
		this.pos.x += this.dir.x * 2;
		this.pos.y += this.dir.y * 2;
	};
	this.onLive = function () {};
	this.setDead = function () {
		this.alive = false;
		this.onDeath();
	};
	this.onDeath = function () {};
	this.takeDamage = function (inDmg) {
		this.hp -= inDmg;
		if (this.hp <= 0) {
			this.onDeath();
		}
		this.alive = false;
	};
	this.isInBounds = function (width, height) {
		if (this.pos.x < 0 || this.pos.x > width) {
			return false;
		}
		if (this.pos.y < 0 || this.pos.y > height) {
			return false;
		}
		return true;
	};
};
