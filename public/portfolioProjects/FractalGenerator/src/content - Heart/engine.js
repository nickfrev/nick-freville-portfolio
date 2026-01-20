/*
//this is a single cell of the vector feild
Cell = function() {
	this.dir = {x:0,y:0};
	this.pressure = 0;
	this.solid = false;
}

//this is a single particle object
Part = function() {
	this.myWorld = null;
	this.worldPos = {x:0,y:0};
	this.pos = {x:0,y:0};
	this.vel = {x:0,y:0};
	this.mass = 1;
	this.col = "rgb(0,255,0)";
	
	this.updateWorldPos = function() {
		//this is to correct the pressure of the feild
		var curPos = {x:Math.floor(this.pos.x),y:Math.floor(this.pos.y)};
		if (curPos.x != this.worldPos.x || curPos.y != this.worldPos.y) {
			this.myWorld[this.worldPos.x][this.worldPos.y].pressure--;
			this.myWorld[curPos.x][curPos.y].pressure++;
			this.worldPos = curPos;
		}
	}
	
}

Engine = function() {
	this.width = 40;
	this.height = 40;
	this.scale = 15;
	
	//this is the matrix that holds all of the cells for the vector feild
	this.world = new Array(this.width);
	for (var x = 0; x < this.width; x++) {
		this.world[x] = new Array(this.height);
		for (var y = 0; y < this.height; y++) {
			var tmp = new Cell();
			tmp.dir.x = 0;
			tmp.dir.y = 1.8;
			this.world[x][y] = tmp;
		}
	}
	//this is the array for all the particles
	this.part = new Array();
	
	//this adds a particle to the world
	this.addPart = function(inPos) {
		var tmp = new Part();
		tmp.myWorld = this.world;
		tmp.pos = inPos;
		tmp.updateWorldPos();
		this.part.push(tmp);
	}
	
	//this draws the particles
	this.draw = function() {
		//clear the screen
		ctx.fillStyle = "rgba(25,25,25,1)";
		ctx.fillRect(0, 0, canvas.width, canvas.height);
		//draw particles
		ctx.fillStyle = "rgba(25,25,200,0.7)";
		ctx.beginPath();
		for (var i = 0; i < this.part.length; i++) {
			var curPart = this.part[i];
			//ctx.beginPath();
			ctx.moveTo(curPart.pos.x*this.scale,curPart.pos.y*this.scale);
			ctx.arc(curPart.pos.x*this.scale,curPart.pos.y*this.scale,3,0,2*Math.PI);
			
		}
		ctx.fill();
		//draw the feild lines
		if (true) {
			ctx.beginPath();
			ctx.strokeStyle = "rgba(25,200,25,0.5)";
			for (var x = 0; x < this.width; x++) {
				for (var y = 0; y < this.height; y++) {
					
					ctx.moveTo(x*this.scale,y*this.scale);
					var tmp = this.world[x][y].dir;
					ctx.lineTo((x+tmp.x/2)*this.scale,(y+tmp.y/2)*this.scale);
				}
			}
			ctx.stroke();
		}
	}
	
	//main Physics run
	this.physRun = function() {
		this.calcFeild();
		this.calcPart();
	}
	
	//calculate the new vectorfeild
	this.calcFeild = function() {
		var area = 2;
		var out;
		for (var x = 0; x < this.width; x++) {
			for (var y = 0; y < this.height; y++) {
				out = this.calcAreaFeild({x:0,y:0},area);
				this.world[x][y].dir.x=out.x;
				this.world[x][y].dir.y=out.y+1;
			}
		}
	}
	
	this.calcAreaFeild = function(inPos, area) {
		var out = {x:0,y:0};
		var dist = 0;
		var G = 1;
		var GMod = 10;//:D
		for (var x = -area; x < area; x++) {
			for (var y = -area; y < area; y++) {
				if (this.posExist({x:inPos.x+x,y:inPos.y+y})) {
					distSqr = x*x+y*y;
					if (distSqr != 0) {
						G = this.world[inPos.x+x][inPos.y+y].pressure*GMod;
						out.x -= (G/distSqr)*x;
						out.y -= (G/distSqr)*y;
					}
				}
			}
		}
		return out;
	}
	
	this.posExist = function(inPos) {
		if (inPos.x < 0 || inPos.x >= this.width) {
			return false;
		}
		if (inPos.y < 0 || inPos.y >= this.height) {
			return false;
		}
		return true;
	}
	
	//move the particles according to the vector feild
	this.calcPart = function() {
		for (var i = 0; i < this.part.length; i++) {
			var curPart = this.part[i];
			//added the vectorfeilds influence
			var curCell = this.world[curPart.worldPos.x][curPart.worldPos.y];
			curPart.vel.x += 0;//curCell.dir.x/this.scale;
			curPart.vel.y += curCell.dir.y/this.scale;
			
			//move the particle
			curPart.pos.x += curPart.vel.x;
			curPart.pos.y += curPart.vel.y;
			
			//check to make sure the part is in bounds
			if (curPart.pos.x >= this.width) {
				curPart.pos.x = this.width-1;
				curPart.vel.x *= -0.5;
			} else if (curPart.pos.x < 0) {
				curPart.pos.x = 0;
				curPart.vel.x *= -0.5;
			}
			
			if (curPart.pos.y >= this.height) {
				curPart.pos.y = this.height-1;
				curPart.vel.y *= -0.5;
			} else if (curPart.pos.y < 0) {
				curPart.pos.y = 0;
				curPart.vel.y *= -0.5;
			}
			
			curPart.updateWorldPos();
		}
	}
	
	
	//some fun functions
	this.setStr = function(inVal) {
		for (var x = 0; x < this.width; x++) {
			for (var y = 0; y < this.height; y++) {
				this.world[x][y].dir.x = Math.sin(x/10)*inVal;
				this.world[x][y].dir.y = Math.sin(y/10)*inVal;
			}
		}
	}
}
*/