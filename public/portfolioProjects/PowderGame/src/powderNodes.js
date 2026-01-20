//some usefull functions for particles
function scanTo(fromPos,toPos,world) {
	//alert(Math.round(fromPos.x)+" "+Math.round(toPos.x)+" "+Math.round(fromPos.y)+" "+Math.round(toPos.y))
	//alert(fromPos.x+" "+toPos.x+" "+fromPos.y+" "+toPos.y)
	
	//console.log("toPos1 "+toPos.x+" "+toPos.y);
	var nextPos = {x:fromPos.x,y:fromPos.y};
	dir = {x:toPos.x-fromPos.x,y:toPos.y-fromPos.y};
	mag = Math.sqrt(dir.x*dir.x+dir.y*dir.y);
	
	
	
	dir.x = dir.x/mag;
	dir.y = dir.y/mag;
	if (dir.x > 0.5) {
		nextPos.x = fromPos.x+1;
	} else if (dir.x < -0.5) {
		nextPos.x = fromPos.x-1;
	}
	
	if (dir.y > 0.5) {
		nextPos.y = fromPos.y+1;
	} else if (dir.y < -0.5) {
		nextPos.y = fromPos.y-1;
	}
	//plane.drawNow({cell:{x:fromPos.x+1,y:fromPos.y},col:"rgb(0,0,255)"});
	//plane.drawNow({cell:{x:nextPos.x,y:nextPos.y},col:"rgb(255,0,255)"});
	if (plane.chkNode({x:nextPos.x,y:nextPos.y}) == null) {
		if (mag < 1) {
			return nextPos;
		}
		//alert("pause");
		return scanTo(nextPos,toPos);
	} else {
		//console.log("fromPos2 "+fromPos.x+" "+fromPos.y);
		return fromPos;//{x:fromPos.x-dir.x,y:fromPos.y-dir.y};
	}
}


//different particles

var solid = function() {
	//NEEDED FOR EVERY PARTICLE
	this.active = true;//is the particle active
	this.idle = 0;
	this.updateID = -1;//the index of the tickQue this is at
	this.world = null;
	this.pos = null;
	this.posReal = null;
	this.col = "rgba(200,200,200,1)";
	
	this.vel = {x:0,y:0};
	this.force = {x:0,y:0};
	this.mass = 0.01;
	
	/////////////////
	// Nessesities //
	/////////////////
	this.setQID = function(inId) {//used to set tickQue ID
		this.updateID = inId;
	}
	
	this.setState = function(inActive) {//set the state of the matter as static or dynamic
		if (inActive != this.active) {//if the state is changing
			this.active = inActive;
		}
	}
	
	this.setWorld = function(inWorld) {//set the world
		if (inWorld != this.world) {//if the world is changing
			this.world = inWorld;
		}
	}
	
	this.setPos = function(inPos) {
		this.pos = {x:Math.round(inPos.x),y:Math.round(inPos.y)};
		this.posReal = inPos;
	}
	
	this.setForce = function(inForce) {
		this.force.x = inForce.x;
		this.force.y = inForce.y;
	}
	
	
	//////////////
	//conditions//
	//////////////
	this.start = function() {//what to do when the particle starts
		this.world.drawNow({cell:{x:this.pos.x,y:this.pos.y},col:this.col});//draw the cell on start
	}
	
	this.refresh = function() {//if something around it moves
		
	}
	
	this.tick = function(step) {//what to do every tick
		
	}
	
	this.stop = function() {//what to do when destroyed
		this.world.drawNow({cell:{x:this.pos.x,y:this.pos.y},col:this.world.background});
		delete this;
	}
}

var powder = function() {
	this.vel = {x:0,y:0};
	this.force = {x:0,y:0};
	
	this.dropSpeed = 0.3;
	this.spread = 1;
	this.grav = 0.25;
	this.airFric = 1;
	this.col = "rgba(200,200,255,1)";
	
	this.refresh = function() {//if something around it moves
		this.world.setActive(this,true);
	}
	
	this.inAir = function(newPos) {
		//simple left right "jitter"
		left = this.world.chkNode({x:newPos.x-this.spread,y:newPos.y}) == null;
		right = this.world.chkNode({x:newPos.x+this.spread,y:newPos.y}) == null;
		if (left && right) {
			if (Math.random() > 0.5) {
				newPos.x-=this.spread;
			} else {
				newPos.x+=this.spread;
			}
		} else if (left) {
			newPos.x-=this.spread;
		} else if (right) {
			newPos.x+=this.spread;
		}
		return newPos;
	}
	
	this.onGround = function(newPos) {
		//settle
		left = this.world.chkNode({x:newPos.x-1,y:newPos.y+1}) == null;
		right = this.world.chkNode({x:newPos.x+1,y:newPos.y+1}) == null;
		if (left && right) {
			if (Math.random() > 0.5) {
				newPos.x--;
				newPos.y++;
			} else {
				newPos.x++;
				newPos.y++;
			}
		} else if (left) {
			newPos.x--;
			newPos.y++;
		} else if (right) {
			newPos.x++;
			newPos.y++;
		}
		return newPos;
	}
	
	this.allTime = function(newPos) {
		//mouseDown = false;
		this.force.y += this.grav*this.mass;//add gravity
		this.vel.x += (this.force.x/this.mass);
		this.vel.y += (this.force.y/this.mass);
		//Math.round(this.pos.x+this.vel.x*this.spread+(Math.random()-0.5)*(this.vel.y*this.spread))
		//newPos = scanTo({x:this.pos.x,y:this.pos.y},{x:Math.round(this.pos.x+this.vel.x*this.dropSpeed),y:Math.round(this.pos.y+this.vel.y*this.dropSpeed)},this.world);
		newPos = scanTo({x:newPos.x,y:newPos.y},{x:newPos.x+this.vel.x*this.dropSpeed,y:newPos.y+this.vel.y*this.dropSpeed},this.world);
		return newPos;
	}
	
	this.scanActive = function(newPos) {
		left = this.world.chkNode({x:newPos.x-1,y:newPos.y}) != null;
		if (left) {
			right = this.world.chkNode({x:newPos.x+1,y:newPos.y}) != null;
			if (right) {
				up = this.world.chkNode({x:newPos.x,y:newPos.y-1}) != null;
				if (up) {
					down = this.world.chkNode({x:newPos.x,y:newPos.y+1}) != null;
					if (down) {
						this.world.setActive(this, false);
						//this.world.drawNow({cell:{x:newPos.x,y:newPos.y},col:"rgb(255,0,0)"});
					}
				}
			}
		}
		this.world.setActive(this, true);
	}
	
	this.tick = function(step) {//what to do every tick
		var newPos = {x:this.posReal.x,y:this.posReal.y};
		//console.log(this.pos.x+" "+this.pos.y);
		//var moved = false;
		newPos = this.allTime(newPos);
		if (this.world.chkNode({x:newPos.x,y:newPos.y+1}) != null) {
			newPos = this.onGround(newPos);
			this.vel.x = 0;//this.vel.x/this.airFric;
			this.vel.y = 0;//this.vel.y/1.1;
		} else {
			newPos = this.inAir(newPos);
		}
		this.vel.x = this.vel.x/this.airFric;
		this.vel.y = this.vel.y/this.airFric;
		
		this.force.x = 0;
		this.force.y = 0;

		this.world.moveNode(this,{x:newPos.x,y:newPos.y});
		//this.scanActive(newPos);
	}
}
powder.prototype = new solid();

var liquid = function() {
	this.vel = {x:0,y:0};
	this.force = {x:0,y:0};
	
	this.dropSpeed = 0.3;
	this.spread = 0.3;
	this.grav = 0.5;
	this.col = "rgba(100,100,255,1)";
	
	this.refresh = function() {//if something around it moves
		this.world.setActive(this,true);
	}
	
	this.onGround = function(newPos) {
		//settle
		left = this.world.chkNode({x:newPos.x-1,y:newPos.y}) == null;
		right = this.world.chkNode({x:newPos.x+1,y:newPos.y}) == null;
		if (left && right) {
			if (Math.random() > 0.5) {
				newPos.x--;
			} else {
				newPos.x++;
			}
		} else if (left) {
			newPos.x--;
		} else if (right) {
			newPos.x++;
		}
		return newPos;
	}
}
liquid.prototype = new powder();

//powders
var sand = function() {
	this.vel = {x:0,y:0};
	this.force = {x:0,y:0};
	this.col = "rgba(200,200,100,1)";
}
sand.prototype = new powder;

var soil = function() {
	this.vel = {x:0,y:0};
	this.force = {x:0,y:0};
	this.dropSpeed = 3;
	this.col = "rgba(139,69,19,1)";
}
soil.prototype = new powder;

var snow = function() {
	this.vel = {x:0,y:0};
	this.force = {x:0,y:0};
	this.airFric = 1.01;
	this.grav = 0.1
	this.col = "rgba(240,240,240,1)";
}
snow.prototype = new powder;

//liquids
var water = function() {
	this.vel = {x:0,y:0};
	this.force = {x:0,y:0};
	this.spread = 1;
	this.col = "rgba(0,100,255,1)";
}
water.prototype = new liquid;

//Entities
var grass = function() {
	this.vel = {x:0,y:0};
	this.force = {x:0,y:0};
	this.col = "rgba(0,200,0,1)";
	
	this.onGround = function(newPos) {
		return newPos;
	}
	
	this.spread = 0;
	//this.inAir = function(newPos) {
	//	newPos.y+=this.dropSpeed;
	//	return newPos;
	//}
	
}
grass.prototype = new powder;

/*
function solid() {
	//NEEDED FOR EVERY PARTICLE
	this.active = false;//is the particle active
	this.updateID = -1;//the index of the tickQue this is at
	this.world = null;
	this.pos = null;
	this.col = "rgba(155,155,155,1)";
	
	/////////////////
	// Nessesities //
	/////////////////
	this.setQID = function(inId) {//used to set tickQue ID
		this.updateID = inId;
	}
	
	this.setState = function(inActive) {//set the state of the matter as static or dynamic
		if (inActive != this.active) {//if the state is changing
			this.active = inActive;
		}
	}
	
	this.setWorld = function(inWorld) {//set the world
		if (inWorld != this.world) {//if the world is changing
			this.world = inWorld;
		}
	}
	
	this.setPos = function(inPos) {
		this.pos = inPos;
	}
	
	//////////////
	//conditions//
	//////////////
	this.start = function() {//what to do when the particle starts
		this.world.drawNow({cell:{x:this.pos.x,y:this.pos.y},col:this.col});//draw the cell on start
	}
	
	this.refresh = function() {//if something around it moves
	
	}
	
	this.tick = function(step) {//what to do every tick
		
	}
	
	this.stop = function() {//what to do when destroyed
		this.world.drawNow({cell:{x:this.pos.x,y:this.pos.y},col:this.world.background});
	}
}

function sandy() {
	//NEEDED FOR EVERY PARTICLE
	this.active = true;//is the particle active
	this.idle = 0;
	this.updateID = -1;//the index of the tickQue this is at
	this.world = null;
	this.pos = null;
	this.col = "rgba(200,200,100,1)";
	
	this.vel = {x:0,y:0};
	this.force = {x:0,y:0};
	this.mass = 0.01;
	//F=MA
	//A=F/M
	/////////////////
	// Nessesities //
	/////////////////
	this.setQID = function(inId) {//used to set tickQue ID
		this.updateID = inId;
	}
	
	this.setState = function(inActive) {//set the state of the matter as static or dynamic
		if (inActive != this.active) {//if the state is changing
			this.active = inActive;
		}
	}
	
	this.setWorld = function(inWorld) {//set the world
		if (inWorld != this.world) {//if the world is changing
			this.world = inWorld;
		}
	}
	
	this.setPos = function(inPos) {
		this.pos = inPos;
	}
	
	//////////////
	//conditions//
	//////////////
	this.start = function() {//what to do when the particle starts
		this.world.drawNow({cell:{x:this.pos.x,y:this.pos.y},col:this.col});//draw the cell on start
	}
	
	this.refresh = function() {//if something around it moves
		this.col = "rgb(100,0,0)";
		this.world.drawNow({cell:{x:this.pos.x,y:this.pos.y},col:this.col});//draw the cell on start
		this.world.setActive(this,true);
	}
	
	this.tick = function(step) {//what to do every tick
		var newPos = {x:this.pos.x,y:this.pos.y};
		var moved = false;
		for (i = 1; i <= step; i++) {
			//editPos.y = i-1;
			if (this.world.chkNode({x:newPos.x,y:newPos.y+1}) == null) {
				newPos.y++;
				moved = true;
				if (Math.random() > 0.75) {
					left = this.world.chkNode({x:newPos.x-1,y:newPos.y}) == null;
					right = this.world.chkNode({x:newPos.x+1,y:newPos.y}) == null;
					if(left && right) {
						if (Math.random() > 0.5) {
							newPos.x--;
						} else {
							newPos.x++;
						}
					} else if (left) {
						newPos.x--;
					} else if (right) {
						newPos.x++;
					}
				}
			} else {
				//check the sides
				//left
				left = this.world.chkNode({x:newPos.x-1,y:newPos.y+1}) == null;
				right = this.world.chkNode({x:newPos.x+1,y:newPos.y+1}) == null;
				if (left) {
					newPos.x--;
					newPos.y++;
					moved = true;
				} else if (right) {
					newPos.x++;
					newPos.y++;
					moved = true;
				}
				//break;
			}
		}
		if (moved) {
			//editPos.y = i-1;
			this.world.moveNode(this,{x:newPos.x,y:newPos.y});
		}
	}
	
	this.stop = function() {//what to do when destroyed
		this.world.drawNow({cell:{x:this.pos.x,y:this.pos.y},col:this.world.background});
		delete this;
	}
}

function dirt() {
	//NEEDED FOR EVERY PARTICLE
	this.active = true;//is the particle active
	this.idle = 0;
	this.updateID = -1;//the index of the tickQue this is at
	this.world = null;
	this.pos = null;
	this.col = "rgba(139,69,19,1)";
	
	/////////////////
	// Nessesities //
	/////////////////
	this.setQID = function(inId) {//used to set tickQue ID
		this.updateID = inId;
	}
	
	this.setState = function(inActive) {//set the state of the matter as static or dynamic
		if (inActive != this.active) {//if the state is changing
			this.active = inActive;
		}
	}
	
	this.setWorld = function(inWorld) {//set the world
		if (inWorld != this.world) {//if the world is changing
			this.world = inWorld;
		}
	}
	
	this.setPos = function(inPos) {
		this.pos = inPos;
	}
	
	//////////////
	//conditions//
	//////////////
	this.start = function() {//what to do when the particle starts
		this.world.drawNow({cell:{x:this.pos.x,y:this.pos.y},col:this.col});//draw the cell on start
	}
	
	this.refresh = function() {//if something around it moves
		this.col = "rgb(100,0,0)";
		this.world.drawNow({cell:{x:this.pos.x,y:this.pos.y},col:this.col});//draw the cell on start
		this.world.setActive(this,true);
	}
	
	this.tick = function(step) {//what to do every tick
		var newPos = {x:this.pos.x,y:this.pos.y};
		var moved = false;
		for (i = 1; i <= step*2; i++) {
			//editPos.y = i-1;
			if (this.world.chkNode({x:newPos.x,y:newPos.y+1}) == null) {
				newPos.y++;
				moved = true;
			} else {
				//check the sides
				//left
				left = this.world.chkNode({x:newPos.x-1,y:newPos.y+1}) == null;
				right = this.world.chkNode({x:newPos.x+1,y:newPos.y+1}) == null;
				if (left) {
					newPos.x-=1;
					moved = true;
				} else if (right) {
					newPos.x+=1;
					moved = true;
				}
				//break;
			}
		}
		if (moved) {
			//editPos.y = i-1;
			this.world.moveNode(this,{x:newPos.x,y:newPos.y});
		}
	}
	
	this.stop = function() {//what to do when destroyed
		this.world.drawNow({cell:{x:this.pos.x,y:this.pos.y},col:this.world.background});
		delete this;
	}
}

function water() {
	//NEEDED FOR EVERY PARTICLE
	this.active = true;//is the particle active
	this.idle = 0;
	this.updateID = -1;//the index of the tickQue this is at
	this.world = null;
	this.pos = null;
	this.col = "rgba(0,0,200,1)";
	
	/////////////////
	// Nessesities //
	/////////////////
	this.setQID = function(inId) {//used to set tickQue ID
		this.updateID = inId;
	}
	
	this.setState = function(inActive) {//set the state of the matter as static or dynamic
		if (inActive != this.active) {//if the state is changing
			this.active = inActive;
		}
	}
	
	this.setWorld = function(inWorld) {//set the world
		if (inWorld != this.world) {//if the world is changing
			this.world = inWorld;
		}
	}
	
	this.setPos = function(inPos) {
		this.pos = inPos;
	}
	
	//////////////
	//conditions//
	//////////////
	this.start = function() {//what to do when the particle starts
		this.world.drawNow({cell:{x:this.pos.x,y:this.pos.y},col:this.col});//draw the cell on start
	}
	
	this.refresh = function() {//if something around it moves
		this.col = "rgb(100,0,0)";
		this.world.drawNow({cell:{x:this.pos.x,y:this.pos.y},col:this.col});//draw the cell on start
		this.world.setActive(this,true);
	}
	
	this.tick = function(step) {//what to do every tick
		var newPos = {x:this.pos.x,y:this.pos.y};
		var moved = false;
		for (i = 1; i <= step; i++) {
			//editPos.y = i-1;
			if (this.world.chkNode({x:newPos.x,y:newPos.y+1}) == null) {
				newPos.y++;
				moved = true;
			} 
			if (this.world.chkNode({x:newPos.x,y:newPos.y+1}) != null) {
				//check the sides
				//left
				left = this.world.chkNode({x:newPos.x-1,y:newPos.y}) == null;
				right = this.world.chkNode({x:newPos.x+1,y:newPos.y}) == null;
				if (left && !right) {
					newPos.x--;
					moved = true;
					i-=0.9;
				} else if (right && !left) {
					newPos.x++;
					moved = true;
					i-=0.9;
				}
				//break;
			}
		}
		if (moved) {
			//editPos.y = i-1;
			this.world.moveNode(this,{x:newPos.x,y:newPos.y});
		}
	}
	
	this.stop = function() {//what to do when destroyed
		this.world.drawNow({cell:{x:this.pos.x,y:this.pos.y},col:this.world.background});
		delete this;
	}
}
*/
