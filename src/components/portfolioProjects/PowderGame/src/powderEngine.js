function clamp(val, min, max) {
	if (val < min) {return min;}
	if (val > max) {return max;}
	return val;
}

MAXDRAWS = 50000;

//this is the function for the world creation
function world(width, height) {
    this.started = false;//has the world been initalized
    this.width = width;//the amount of cells on the x axis in the world matrix
	this.height = height;//the amount of cells on the y axis in the world matrix
	this.background = "rgb(0,0,0)";

	this.resX = canvas.width/width;//How big the world matrix cells appear on the screen x direction
	this.resY = canvas.height/height;//How big the world matrix cells appear on the screen y direction
	this.curColor = "x";

	this.matter = [];//The matter matrix that holds the world

	this.drawQue = [];//if something changes this will hold the draw difference
	//info in the drawque is this format: {cell:{x:0,y:0},col:"rgba(0,0,0,0)"}

	this.tickQue = [];//these are the nodes that move and should be updated
		this.tickCur = 0;

	this.statQue = [];//these are the nodes that do not move

    //Initalize the matter matrix with empty data
	this.startWorld = function() {
		for (x = 0; x < this.width; x++) {
			this.matter[x] = [];
			for (y = 0; y < this.height; y++) {
				this.matter[x][y] = {
					//the default data for a cell
					node:null
				};
			}
		}
		this.started = true;
	}

	//figure out the next frame of data
	this.tick = function(step) {
		if (step > 0) {//makes any negative number or 0 freeze time
			if (this.tickCur >= step) {
				this.tickCur = 0;
			}
			for (tickCnt = this.tickCur; tickCnt < this.tickQue.length; tickCnt+=step) {
				if (tickCnt != this.tickQue[tickCnt].updateID) {
					alert("de-synced tickQue "+tickCnt+", "+this.tickQue[tickCnt].updateID);
					this.tickQue[tickCnt].setQID(tickCnt);
				}
				if (this.tickQue[tickCnt].active == true) {
					this.tickQue[tickCnt].tick(step);
				}
			}
			this.tickCur++;
		}
	}
	//things to keep tickQue and statQue in order
		this.addTick = function(inNode) {
			inNode.setQID(this.tickQue.length);
			this.tickQue.push(inNode);
		}

		this.remTick = function(inId) {
			//this.tickQue[inId].updateID = -1;
			this.tickQue.splice(inId, 1);
			//feel like there is a better way to do this
			for (i = inId; i < this.tickQue.length; i++) {
				this.tickQue[i].setQID(i);
			}
			//console.log(this.tickQue.length+",\t"+inId);
		}

		this.addStat = function(inNode) {
			inNode.setQID(this.statQue.length);
			this.statQue.push(inNode);
			this.drawQue.push({cell:{x:inNode.pos.x,y:inNode.pos.y},col:inNode.col,drawBig:true});
		}

		this.remStat = function(inId) {
			//this.statQue[inId].updateID = -1;
			this.statQue.splice(inId, 1);
			//feel like there is a better way to do this
			for (i = inId; i < this.statQue.length; i++) {
				this.statQue[i].setQID(i);
			}
			//console.log(this.tickQue.length+",\t"+inId);
		}



	//draw the things that must be drawn
	this.draw = function() {
		var cur;
		curDrawAmt = this.drawQue.length;//get the amount of things that need to be drawn
		for (i = 0; i < clamp(curDrawAmt, 0, MAXDRAWS); i++) {
			cur = this.drawQue.shift();
			if (cur.col != this.curColor) {//if the current color isn't the right color change it
				this.curColor = cur.col;
				context.fillStyle = cur.col;
			}
			var addSpace = cur.drawBig ? 0.5 : 0;
			context.fillRect(cur.cell.x*this.resX - addSpace, cur.cell.y*this.resY - addSpace, this.resX + addSpace * 2, this.resY+ addSpace * 2);
		}
	}

	//draw this now
	this.drawNow = function(cur) {
		//if (cur.col != this.curColor) {//if the current color isn't the right color change it
		//	this.curColor = cur.col;
		//
		//}
		context.fillStyle = cur.col;
		context.fillRect(cur.cell.x*this.resX, cur.cell.y*this.resY, this.resX, this.resY);
	}

	//add a node in matter
	this.addNode = function(inPos, inActive, inNode) {
		//make sure the pos is in the matrix
		if (this.posExists(inPos)) {
			//see if the spot is filled, if it isn't fill it
			if (this.matter[inPos.x][inPos.y].node == null) {
				//create the node and start it
				inNode.setWorld(this);
				inNode.setPos(inPos);
				inNode.setState(inActive);
				inNode.start();
				this.matter[inPos.x][inPos.y].node = inNode;//put the matter into the matrix
				//put the node in the appropriate array
				if (inActive) {
					this.addTick(inNode);
				} else {
					this.addStat(inNode);
				}
			}
		}
	}

	this.posExists = function(inPos) {
		return (Math.round(inPos.x) < this.width && Math.round(inPos.x) >= 0 && Math.round(inPos.y) < this.height && Math.round(inPos.y) > 0);
	}

	//check a node in the matrix
	this.chkNode = function(inPos) {
		// if the position is in the matrix
		if (this.posExists(inPos)) {
			return this.matter[Math.round(inPos.x)][Math.round(inPos.y)].node;
		} else {
			return null;
		}
	}

	//remove a node in matter
	this.remNode = function(inNode) {
		//console.log(inNode.updateID);
		if (inNode != null) {
			//remove it from the matrix
			this.matter[inNode.pos.x][inNode.pos.y].node = null;
			//remove it from the appropriate que
			if (inNode.active) {
				this.remTick(inNode.updateID);
			} else {
				this.remStat(inNode.updateID);
			}
			//delete the data
			inNode.stop();
		}
	}

	//swap a node in matter
	this.swapNode = function(inX, inY, inNode) {
		this.matter[inX][inY].node = node;
	}

	this.activateCells = function(inPos) {
		tmp = this.chkNode({x:inPos.x-1,y:inPos.y})
		if (tmp != null) {
			if (!tmp.active) {
				this.setActive(tmp,true);
			}
		}
		tmp = this.chkNode({x:inPos.x+1,y:inPos.y})
		if (tmp != null) {
			if (!tmp.active) {
				this.setActive(tmp,true);
			}
		}tmp = this.chkNode({x:inPos.x,y:inPos.y+1})
		if (tmp != null) {
			if (!tmp.active) {
				this.setActive(tmp,true);
			}
		}tmp = this.chkNode({x:inPos.x,y:inPos.y-1})
		if (tmp != null) {
			if (!tmp.active) {
				this.setActive(tmp,true);
			}
		}
	}

	//move a node
	this.moveNode = function(inNode, inPos) {
		if (this.posExists(inPos)) {//if it is inside the world, continue
			if (inNode.pos.x != inPos.x || inNode.pos.y != inPos.y) {//if it has moved
				//remove it from the current cell
				this.drawQue.push({cell:{x:inNode.pos.x,y:inNode.pos.y},col:this.background,drawBig:true});
				this.matter[inNode.pos.x][inNode.pos.y].node = null;

				this.activateCells({x:inNode.pos.x,y:inNode.pos.y});

				//if the cell has something in there already remove it
				if (this.matter[Math.round(inPos.x)][Math.round(inPos.y)].node != null) {
					this.remNode(this.matter[Math.round(inPos.x)][Math.round(inPos.y)].node);
				}
				//change the positions
				inNode.setPos(inPos);
				//move the node to the new cell
				this.drawQue.push({cell:{x:inNode.pos.x,y:inNode.pos.y},col:inNode.col});
				this.matter[inNode.pos.x][inNode.pos.y].node = inNode;//put the matter into the matrix

			}
		} else {//it is outside the world, remove it
			this.remNode(inNode);
		}
	}

	this.setActive = function(inNode, inActive) {
		if (inNode != null) {
			/*if (inNode.active != inActive) {
				//if (inActive) {//add the node to tickQue and remove from statQue
				//	this.remStat(inNode.updateID);
				//	this.addTick(inNode);
				//} else {//add the node to statQue and remove from tickQue
				//	this.remTick(inNode.updateID);
				//	this.addStat(inNode);
				//}
				if (inActive == true) {
					this.drawNow({cell:{x:inNode.pos.x,y:inNode.pos.y},col:"rgb(0,255,0)"});
				} else {
					this.drawNow({cell:{x:inNode.pos.x,y:inNode.pos.y},col:"rgb(255,0,0)"});
				}
				inNode.setState(inActive);
			}*/
		}
	}
}
