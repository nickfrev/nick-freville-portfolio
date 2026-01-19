window.onload = init;

var gridSize = {x:30,y:30};

var threats = new Array();
var map = new Array();

var port = {x:100,y:50,w:700,h:700};
var state = 0;
var tool = 1;
var toolSize = 6;
var MaxPlyPerSquare = 10;
var npc_speed = 0.3;

mousePos = {x:0,y:0};
toolTip = "";

var overlay = 0;
var showDir = false;
var showWeight = false;
var avoidMag = 30;

function clickPnt(inPos, val) {
	var width = port.w/gridSize.x;
	var height = port.h/gridSize.y;
	var lasPos = {x:(inPos.x-port.x)/width,y:(inPos.y-port.y)/height};
	if (lasPos.x >= 0 && lasPos.y >= 0 && lasPos.x < gridSize.x && lasPos.y < gridSize.y) {
		if (tool == 0) {
			threats[Math.floor(lasPos.x)][Math.floor(lasPos.y)][overlay].threat = val;
			calcDist();
		} else if (tool == 1) {
			map[Math.floor(lasPos.x)][Math.floor(lasPos.y)] = val;
			if (val == 5 || val == 1 || val == 0) {//if a wall or goal is placed recalc
				calcDist();
			}
		}
	} else if (Math.floor(lasPos.x) == gridSize.x+1) {
		if (lasPos.y < toolSize) {
			state = Math.floor(lasPos.y);
			tool = 1;
		}
	} else if (Math.floor(lasPos.x) == gridSize.x) {
		if (lasPos.y >= 0 && lasPos.y < gridSize.y-1) {
			state = lasPos.y/(gridSize.y-1);
			tool = 0;
		} else if (Math.floor(lasPos.y) == gridSize.y-1) {
			runAmt--;
			if (runAmt < 1) {
				runAmt = 1;
			}
		}
	} else if (Math.floor(lasPos.x) == gridSize.x+2) {
		if (lasPos.y >= 0 && lasPos.y < 3) {
			overlay = Math.floor(lasPos.y);
		} else if (Math.floor(lasPos.y) == 3) {
			showDir = !showDir;
		} else if (Math.floor(lasPos.y) == 4) {
			genMap();//reset the map
			npc_blue = new Array();
			npc_red = new Array();
			npc_grey = new Array();
		} else if (Math.floor(lasPos.y) == gridSize.y-1) {
			runAmt++;
		}
	}
}

var mouseDown = false;
window.addEventListener('mousemove', function(evt) {
	var width = port.w/gridSize.x;
	var height = port.h/gridSize.y;
	var stateT;
	mousePos = {x:evt.offsetX,y:evt.offsetY};
	var lasPos = {x:(mousePos.x-port.x)/width,y:(mousePos.y-port.y)/height};
	
	if (mouseDown && lasPos.x < gridSize.x) {
		clickPnt({x:evt.offsetX,y:evt.offsetY},state);
	}
	
	//look for tool tips
	if (Math.floor(lasPos.x) == gridSize.x+1) {
		if (lasPos.y >= 0 && lasPos.y < gridSize.y) {
			stateT = Math.floor(lasPos.y);
			if (stateT == 0) {
				toolTip = "Erase";
			} else if (stateT == 1) {
				toolTip = "Wall";
			} else if (stateT == 2) {
				toolTip = "Red Spawn Point";
			} else if (stateT == 3) {
				toolTip = "Blue Spawn Point";
			} else if (stateT == 4) {
				toolTip = "Grey Spawn Point";
			} else if (stateT == 5) {
				toolTip = "Goal";
			} else {
				toolTip = "";
			}
		} else {
			toolTip = "";
		}
	} else if (Math.floor(lasPos.x) == gridSize.x) {
		if (lasPos.y >= 0 && lasPos.y < (gridSize.y-1)) {
			stateT = Math.floor(lasPos.y);
			toolTip = "Avoid Area at: "+(1-lasPos.y/(gridSize.y-1)).toFixed(3);
		} else if (Math.floor(lasPos.y) == gridSize.y-1) {
			stateT = Math.floor(lasPos.y);
			toolTip = "Run Slower";
		} else {
			toolTip = "";
		}
	}  else if (Math.floor(lasPos.x) == gridSize.x+2) {
		if (lasPos.y >= 0 && lasPos.y < gridSize.y-1) {
			stateT = Math.floor(lasPos.y);
			if (stateT == 0) {
				toolTip = "Red Logic Layer";
			} else if (stateT == 1) {
				toolTip = "Blue Logic Layer";
			} else if (stateT == 2) {
				toolTip = "Grey Logic Layer";
			} else if (stateT == 3) {
				toolTip = "Vector Feild";
			} else if (stateT == 4) {
				toolTip = "Clear Map";
			} else {
				toolTip = "";
			}
		} else if (Math.floor(lasPos.y) == gridSize.y-1) {
			toolTip = "Run Faster";
		} else {
			toolTip = "";
		}
	}else {
		toolTip = "";
	}
}, false);

window.addEventListener('mousedown', function(evt) {
	mouseDown = true;
	clickPnt({x:evt.offsetX,y:evt.offsetY},state);
}, false);

window.addEventListener('mouseup', function(evt) {
	mouseDown = false;
}, false);

window.addEventListener("keydown", function(evt) {
    //alert("keydown: " + evt.keyCode);
	if (evt.keyCode == 87) {//W
		runGame();
	}
}, false);

function drawSquareThreat(val,x,y) {
	var width = port.w/gridSize.x;
	var height = port.h/gridSize.y;
	ctx.linewidth = 3;
	var added = 1;
	var tmp;
	if (val >= 0) {
		ctx.beginPath();
		tmp = Math.round(255*(1-val));
		ctx.fillStyle = "rgb("+0+","+tmp+","+tmp+")";
		ctx.rect(port.x+width*x,port.y+height*y,width+added,height+added);
		ctx.fill();
	}
}

function drawSquareMap(val,x,y) {
	var width = port.w/gridSize.x;
	var height = port.h/gridSize.y;
	var added = 1;
	ctx.linewidth = 5;
	if (val == 0) {
		
	} else if (val == 1) {
		ctx.beginPath();
		ctx.strokeStyle = "rgb(255,255,255)";
		ctx.rect(port.x+width*x,port.y+height*y,width+added,height+added);
		ctx.stroke();
		ctx.fillStyle = "rgba(0,0,0,0.25)";
		ctx.rect(port.x+width*x,port.y+height*y,width+added,height+added);
		ctx.fill();
	} else if (val == 2) {
		ctx.beginPath();
		ctx.fillStyle = "rgb(255,0,0)";
		ctx.rect(port.x+width*x,port.y+height*y,width+added,height+added);
		ctx.fill();
	} else if (val == 3) {
		ctx.beginPath();
		ctx.fillStyle = "rgb(0,0,255)";
		ctx.rect(port.x+width*x,port.y+height*y,width+added,height+added);
		ctx.fill();
	} else if (val == 4) {
		ctx.beginPath();
		ctx.fillStyle = "rgb(100,100,100)";
		ctx.rect(port.x+width*x,port.y+height*y,width+added,height+added);
		ctx.fill();
	}  else if (val == 5) {
		ctx.beginPath();
		ctx.fillStyle = "rgb(100,255,100)";
		ctx.rect(port.x+width*x,port.y+height*y,width+added,height+added);
		ctx.fill();
	}  else if (val == 6) {
		ctx.beginPath();
		ctx.strokeStyle = "rgb(255,255,0)";
		ctx.rect(port.x+width*x,port.y+height*y,width+added,height+added);
		ctx.stroke();
	}  else if (val == 7) {
		ctx.beginPath();
		ctx.fillStyle = "rgb(0,0,0)";
		ctx.rect(port.x+width*x,port.y+height*y,width+added,height+added);
		ctx.fill();
		
		ctx.beginPath();
		var cur = {x:port.x+width*x+width/2,y:port.y+height*y+height/2};
		ctx.strokeStyle = "rgb(255,255,255)";
		ctx.moveTo(cur.x+3,cur.y);
		ctx.arc(cur.x,cur.y,3,0,2*Math.PI);
		ctx.moveTo(cur.x,cur.y);
		ctx.lineTo(cur.x+width/2, cur.y);
		ctx.stroke();
	}  else if (val == 8) {
		ctx.beginPath();
		ctx.strokeStyle = "rgb(255,0,255)";
		ctx.rect(port.x+width*x,port.y+height*y,width+added,height+added);
		
		ctx.moveTo(port.x+width*(x+0.25),port.y+height*(y+0.5));
		ctx.lineTo(port.x+width*(x+0.75),port.y+height*(y+0.5));
		ctx.stroke();
	}  else if (val == 9) {
		ctx.beginPath();
		ctx.strokeStyle = "rgb(255,0,255)";
		ctx.rect(port.x+width*x,port.y+height*y,width+added,height+added);
		
		ctx.moveTo(port.x+width*(x+0.25),port.y+height*(y+0.5));
		ctx.lineTo(port.x+width*(x+0.75),port.y+height*(y+0.5));
		ctx.moveTo(port.x+width*(x+0.5),port.y+height*(y+0.25));
		ctx.lineTo(port.x+width*(x+0.5),port.y+height*(y+0.75));
		ctx.stroke();
	}  else if (val == 10) {
		ctx.beginPath();
		ctx.strokeStyle = "rgb(255,0,0)";
		ctx.rect(port.x+width*x,port.y+height*y,width+added,height+added);
		
		ctx.moveTo(port.x+width*(x),port.y+height*(y));
		ctx.lineTo(port.x+width*(x+1),port.y+height*(y+1));
		ctx.moveTo(port.x+width*(x+1),port.y+height*(y));
		ctx.lineTo(port.x+width*(x),port.y+height*(y+1));
		ctx.stroke();
	}
}

var goals = new Array();
goals[0] = new Array();
goals[1] = new Array();
goals[2] = new Array();
var distCalc = new Array();
function calcDist() {
	goals = new Array();
	goals[0] = new Array();
	goals[1] = new Array();
	goals[2] = new Array();
	//get all of the goals
	for (var x = 0; x < gridSize.x; x++) {
		for (var y = 0; y < gridSize.y; y++) {
			if (map[x][y] == 5) {
				goals[0].push({x:x,y:y,val:0});
				goals[1].push({x:x,y:y,val:0});
				goals[2].push({x:x,y:y,val:0});
				distCalc[x][y][0] = true;
				distCalc[x][y][1] = true;
				distCalc[x][y][2] = true;
			} else if (map[x][y] == 1) {
				distCalc[x][y][0] = true;
				distCalc[x][y][1] = true;
				distCalc[x][y][2] = true;
			} else {
				distCalc[x][y][0] = false;
				distCalc[x][y][1] = false;
				distCalc[x][y][2] = false;
			}
		}
	}
	dirCur[0] = 0;
	dirCur[1] = 0;
	dirCur[2] = 0;
}

function distAval(x,y) {
	if (x < gridSize.x && x >= 0) {
		if (y < gridSize.y && y >= 0) {
			if (map[x][y] == 1) {
				return false;
			}
		} else {
			return false;
		}
	} else {
		return false;
	}
	return true;
}


function calcDistCycle(inTeam) {
	//use some cycling
	var tmp;
	var passOn;
	for (var i = 0; i < 1000; i++) {
		if (goals[inTeam].length > 0) {
			tmp = goals[inTeam].shift();
			threats[tmp.x][tmp.y][inTeam].dist = tmp.val;//+(1-threats[tmp.x][tmp.y][0].threat)*avoidMag;
			threats[tmp.x][tmp.y][inTeam].val = tmp.val;//+(1-threats[tmp.x][tmp.y][0].threat)*avoidMag;
			passOn = tmp.val+1;//+(1-threats[tmp.x][tmp.y][0].threat)*avoidMag
			//x val
			if (distAval(tmp.x+1,tmp.y)) {
				passOn = tmp.val+1+(1-threats[tmp.x+1][tmp.y][inTeam].threat)*avoidMag;
				if (!distCalc[tmp.x+1][tmp.y][inTeam]) {
					goals[inTeam].push({x:tmp.x+1,y:tmp.y,val:passOn});
					threats[tmp.x+1][tmp.y][inTeam].dist = passOn;
					distCalc[tmp.x+1][tmp.y][inTeam] = true;
				} else if (passOn < threats[tmp.x+1][tmp.y][inTeam].dist) {
					goals[inTeam].push({x:tmp.x+1,y:tmp.y,val:passOn});
					threats[tmp.x+1][tmp.y][inTeam].dist = passOn;
					distCalc[tmp.x+1][tmp.y][inTeam] = true;
				}
			}
			
			if (distAval(tmp.x-1,tmp.y)) {
				passOn = tmp.val+1+(1-threats[tmp.x-1][tmp.y][inTeam].threat)*avoidMag;
				if (!distCalc[tmp.x-1][tmp.y][inTeam]) {
					goals[inTeam].push({x:tmp.x-1,y:tmp.y,val:passOn});
					threats[tmp.x-1][tmp.y][inTeam].dist = passOn;
					distCalc[tmp.x-1][tmp.y][inTeam] = true;
				} else if (passOn < threats[tmp.x-1][tmp.y][inTeam].dist) {
					goals[inTeam].push({x:tmp.x-1,y:tmp.y,val:passOn});
					threats[tmp.x-1][tmp.y][inTeam].dist = passOn;
					distCalc[tmp.x-1][tmp.y][inTeam] = true;
				}
			}
			//y val
			if (distAval(tmp.x,tmp.y+1)) {
				passOn = tmp.val+1+(1-threats[tmp.x][tmp.y+1][inTeam].threat)*avoidMag;
				if (!distCalc[tmp.x][tmp.y+1][inTeam]) {
					goals[inTeam].push({x:tmp.x,y:tmp.y+1,val:passOn});
					threats[tmp.x][tmp.y+1][inTeam].dist = passOn;
					distCalc[tmp.x][tmp.y+1][inTeam] = true;
				} else if (passOn < threats[tmp.x][tmp.y+1][inTeam].dist) {
					goals[inTeam].push({x:tmp.x,y:tmp.y+1,val:passOn});
					threats[tmp.x][tmp.y+1][inTeam].dist = passOn;
					distCalc[tmp.x][tmp.y+1][inTeam] = true;
				}
			}
			if (distAval(tmp.x,tmp.y-1)) {
				passOn = tmp.val+1+(1-threats[tmp.x][tmp.y-1][inTeam].threat)*avoidMag;
				if (!distCalc[tmp.x][tmp.y-1][inTeam]) {
					goals[inTeam].push({x:tmp.x,y:tmp.y-1,val:passOn});
					threats[tmp.x][tmp.y-1][inTeam].dist = passOn;
					distCalc[tmp.x][tmp.y-1][inTeam] = true;
				} else if (passOn < threats[tmp.x][tmp.y-1][inTeam].dist) {
					goals[inTeam].push({x:tmp.x,y:tmp.y-1,val:passOn});
					threats[tmp.x][tmp.y-1][inTeam].dist = passOn;
					distCalc[tmp.x][tmp.y-1][inTeam] = true;
				}
			}
			
		} else {
			break;
		}
	}
}

function cellExist(x,y) {
	if (x < gridSize.x && x >= 0) {
		if (y < gridSize.y && y >= 0) {
			if (map[x][y] == 1) {
				return false;
			}
		} else {
			return false;
		}
	} else {
		return false;
	}
	return true;
}

function calDirDist(x,y,inVal) {
	var max = threats[x][y][inVal].dist;
	threats[x][y][inVal].dir = {x:0,y:0};
	//x val derf
	if (cellExist(x+1,y)) {
		if (threats[x+1][y][inVal].dist < max) {
			max = threats[x+1][y][inVal].dist
			threats[x][y][inVal].dir = {x:1,y:0};
		}
	}
	
	if (cellExist(x-1,y)) {
		if (threats[x-1][y][inVal].dist < max) {
			max = threats[x-1][y][inVal].dist
			threats[x][y][inVal].dir = {x:-1,y:0};
		}
	}
	
	//y val
	if (cellExist(x,y+1)) {
		if (threats[x][y+1][inVal].dist < max) {
			max = threats[x][y+1][inVal].dist
			threats[x][y][inVal].dir = {x:0,y:1};
		}
	}
	if (cellExist(x,y-1)) {
		if (threats[x][y-1][inVal].dist < max) {
			max = threats[x][y-1][inVal].dist
			threats[x][y][inVal].dir = {x:0,y:-1};
		}
	}
	/*
	////////////////////
	//x val
	if (cellExist(x+1,y+1)) {
		if (threats[x+1][y+1][inVal].dist < max) {
			max = threats[x+1][y+1][inVal].dist
			threats[x][y][inVal].dir = {x:1,y:1};
		}
	}
	if (cellExist(x-1,y+1)) {
		if (threats[x-1][y+1][inVal].dist < max) {
			max = threats[x-1][y+1][inVal].dist
			threats[x][y][inVal].dir = {x:-1,y:1};
		}
	}
	//y val
	if (cellExist(x+1,y-1)) {
		if (threats[x+1][y-1][inVal].dist < max) {
			max = threats[x+1][y-1][inVal].dist
			threats[x][y][inVal].dir = {x:1,y:-1};
		}
	}
	if (cellExist(x-1,y-1)) {
		if (threats[x-1][y-1][inVal].dist < max) {
			max = threats[x-1][y-1][inVal].dist
			threats[x][y][inVal].dir = {x:-1,y:-1};
		}
	}
	*/
}

function calDirVal(x,y,inVal) {
	var max = 99999;//threats[x][y][inVal].val;
	threats[x][y][inVal].dir = {x:0,y:0};
	var up = false;
	var down = false;
	var left = false;
	var right = false;
	//x val derf
	if (cellExist(x+1,y)) {
		right = true;
		if (threats[x+1][y][inVal].val < max) {
			max = threats[x+1][y][inVal].val
			threats[x][y][inVal].dir = {x:1,y:0};
		}
	}
	
	if (cellExist(x-1,y)) {
		left = true;
		if (threats[x-1][y][inVal].val < max) {
			max = threats[x-1][y][inVal].val
			threats[x][y][inVal].dir = {x:-1,y:0};
		}
	}
	
	//y val
	if (cellExist(x,y+1)) {
		up = true;
		if (threats[x][y+1][inVal].val < max) {
			max = threats[x][y+1][inVal].val
			threats[x][y][inVal].dir = {x:0,y:1};
		}
	}
	if (cellExist(x,y-1)) {
		down = true;
		if (threats[x][y-1][inVal].val < max) {
			max = threats[x][y-1][inVal].val
			threats[x][y][inVal].dir = {x:0,y:-1};
		}
	}
	
	////////////////////
	
	//x val
	if (cellExist(x+1,y+1) && right && up) {//right && up stops them from cutting corners
		if (threats[x+1][y+1][inVal].val < max) {
			max = threats[x+1][y+1][inVal].val
			threats[x][y][inVal].dir = {x:1,y:1};
		}
	}
	if (cellExist(x-1,y+1) && left && up) {
		if (threats[x-1][y+1][inVal].val < max) {
			max = threats[x-1][y+1][inVal].val
			threats[x][y][inVal].dir = {x:-1,y:1};
		}
	}
	//y val
	if (cellExist(x+1,y-1) && right && down) {
		if (threats[x+1][y-1][inVal].val < max) {
			max = threats[x+1][y-1][inVal].val
			threats[x][y][inVal].dir = {x:1,y:-1};
		}
	}
	if (cellExist(x-1,y-1) && left && down) {
		if (threats[x-1][y-1][inVal].val < max) {
			max = threats[x-1][y-1][inVal].val
			threats[x][y][inVal].dir = {x:-1,y:-1};
		}
	}
	
}

var dirCur = new Array();
dirCur[0] = 0;
dirCur[1] = 0;
dirCur[2] = 0;
function calcDir(inTeam) {
	var x = 0;
	var y = 0;
	var tmp = dirCur[inTeam];
	for (var i = tmp; i < tmp+1000; i++) {
		dirCur[inTeam] = i;
		if (i < gridSize.x*gridSize.y) {
			x = i%gridSize.x;
			y = Math.floor(i/gridSize.x);
			calDirVal(x,y,inTeam);
		} else {
			break;
		}
	}
}

function toWorld(inVal) {
	var w = port.w/gridSize.x;
	var h = port.h/gridSize.y;
	
	var outX = port.x+inVal.x*w+w/2;
	var outY = port.y+inVal.y*h+h/2;
	return {x:outX,y:outY};
}

function drawNPCs(inArray, inCol) {
	var tmp;
	ctx.strokeStyle = inCol;//
	ctx.beginPath();
	for (var i = 0; i < inArray.length; i++) {
		tmp = toWorld(inArray[i].pos);
		ctx.moveTo(tmp.x,tmp.y);
		ctx.arc(tmp.x,tmp.y,5,0,2*Math.PI);
		if (inArray[i].target && inArray[i].tarTime > 0) {
			ctx.moveTo(tmp.x,tmp.y);
			tmp = toWorld(inArray[i].target.pos);
			ctx.lineTo(tmp.x,tmp.y);
			//inArray[i].target = null;
			inArray[i].tarTime--;
		}
	}
	ctx.stroke();
}

function drawMap() {
	//clear the screen
	ctx.fillStyle = "rgb(15,15,15)";
	ctx.fillRect(0, 0, canvas.width, canvas.height);
	//draw the threat
	var tmp = 0;
	for (var x = 0; x < gridSize.x; x++) {
		for (var y = 0; y < gridSize.y; y++) {
			tmp = threats[x][y][overlay].threat;
			drawSquareThreat(tmp,x,y);
		}
	}
	//draw the map
	for (var x = 0; x < gridSize.x; x++) {
		for (var y = 0; y < gridSize.y; y++) {
			tmp = map[x][y];
			drawSquareMap(tmp,x,y);
		}
	}
	drawNPCs(npc_red,"rgba(255,0,0,1)");
	drawNPCs(npc_blue,"rgba(0,0,255,1)");
	drawNPCs(npc_grey,"rgba(100,100,100,0.5)");
	drawTools();
	if (showDir) {
		drawDir();
	}
	if (showWeight) {
		drawWeight();
	}
}

function drawWeight() {
	var width = port.w/gridSize.x;
	var height = port.h/gridSize.y;
	ctx.font = "10px Arial";
	var tmp;
	for (var x = 0; x < gridSize.x; x++) {
		for (var y = 0; y < gridSize.y; y++) {
			tmp = threats[x][y][overlay].dist;
			ctx.fillStyle = "rgb(0,"+Math.round(tmp*6)+",255)";
			ctx.fillText(Math.floor(tmp),port.x+width*x+(0.5*width),port.y+height*y+(0.5*height));
		}
	}
}

var dirLen = 10;
function drawDir() {
	var width = port.w/gridSize.x;
	var height = port.h/gridSize.y;
	dirLen = width-3;
	var tmp;
	var cur;
	ctx.beginPath();
	ctx.strokeStyle = "rgb(0,100,0)";
	for (var x = 0; x < gridSize.x; x++) {
		for (var y = 0; y < gridSize.y; y++) {
			if (map[x][y] != 1) {
				tmp = threats[x][y][overlay].dir;
				cur = {x:port.x+width*x+(0.5*width),y:port.y+height*y+(0.5*height)};
				ctx.moveTo(cur.x+3,cur.y);
				ctx.arc(cur.x,cur.y,3,0,2*Math.PI);
				ctx.moveTo(cur.x,cur.y);
				ctx.lineTo(cur.x+tmp.x*dirLen, cur.y+tmp.y*dirLen);
			}
		}
	}
	ctx.stroke();
}

function drawToolTip() {
	ctx.font = "12px Arial";
	ctx.textAlign = 'center';
	ctx.fillStyle = "rgb(255,255,255)";
	ctx.fillText(toolTip,mousePos.x,mousePos.y);
}

function drawTools() {
	var startx = port.x+port.w;
	var starty = port.y;
	
	for (var i = 0; i < toolSize; i++) {
		drawSquareMap(i,gridSize.x+1,i);
	}
	for (var i = 0; i < gridSize.y-1; i++) {
		drawSquareThreat(i/(gridSize.y-1),gridSize.x,i);
	}
	drawSquareMap(7,gridSize.x+2,3);//vector feild
	drawSquareMap(10,gridSize.x+2,4);//clear map
	
	drawSquareMap(2,gridSize.x+2,0);
	drawSquareMap(3,gridSize.x+2,1);
	drawSquareMap(4,gridSize.x+2,2);
	drawSquareMap(6,gridSize.x+2,overlay);
	if (tool == 0) {
		drawSquareMap(6,gridSize.x+tool,Math.floor(state*gridSize.y));
	} else {
		drawSquareMap(6,gridSize.x+tool,state);
	}
	
	//draw speed control
	drawSquareThreat(1,gridSize.x,gridSize.y-1);
	drawSquareThreat(1,gridSize.x+1,gridSize.y-1);
	drawSquareThreat(1,gridSize.x+2,gridSize.y-1);
	drawSquareMap(8,gridSize.x,gridSize.y-1);
	drawSquareMap(9,gridSize.x+2,gridSize.y-1);
	
	drawToolTip();
	
	var width = port.w/gridSize.x;
	var height = port.h/gridSize.y;
	ctx.fillStyle = "rgb(0,255,255)";
	ctx.fillText(runAmt,port.x+width*(gridSize.x+1.5),port.y+height*(gridSize.y-0.25));
}

function genMap() {
	for (var x = 0; x < gridSize.x; x++) {
		threats[x] = new Array();
		map[x] = new Array();
		distCalc[x] = new Array();
		for (var y = 0; y < gridSize.y; y++) {
			map[x][y] = 0;
			distCalc[x][y] = new Array();
			distCalc[x][y][0] = false;
			distCalc[x][y][1] = false;
			distCalc[x][y][2] = false;
			threats[x][y] = new Array();
			threats[x][y][0] = {threat:1,dist:0,val:0,dir:{x:0,y:0}};//red
			threats[x][y][1] = {threat:1,dist:0,val:0,dir:{x:0,y:0}};//blue
			threats[x][y][2] = {threat:1,dist:0,val:0,dir:{x:0,y:0}};//grey
		}
	}
}

//game part
function diedAt(team,pos) {
	if (team == 2) {return false;}
	var mag;
	for (var x = -2; x < 2; x++) {
		for (var y = -2; y < 2; y++) {
			mag = Math.sqrt(x*x+y*y);
			if (cellExist(pos.x+x,pos.y+y)) {
				threats[pos.x+x][pos.y+y][team].threat -= 0.1*(1-(mag/3));
				if (threats[pos.x+x][pos.y+y][team].threat < 0) {
					threats[pos.x+x][pos.y+y][team].threat = 0;
				}
			}
		}	
	}
}

function killedAt(team,pos) {
	if (team == 2) {return false;}
	var mag;
	for (var x = -2; x < 2; x++) {
		for (var y = -2; y < 2; y++) {
			mag = Math.sqrt(x*x+y*y);
			if (cellExist(pos.x+x,pos.y+y)) {
				threats[pos.x+x][pos.y+y][team].threat += 0.01*(1-(mag/3));
				if (threats[pos.x+x][pos.y+y][team].threat > 1) {
					threats[pos.x+x][pos.y+y][team].threat = 1;
				}
			}
		}	
	}
}

npc = function(inPos, enemy1, enemy2) {
	this.pos = inPos;
	this.vel = {x:0,y:0};
	this.target = null;
	this.tarTime = 0;
	this.enemy1 = enemy1;
	this.enemy2 = enemy2;
	this.hp = 10;
}

function addTime(inTeam,x,y) {
	threats[x][y][inTeam].threat += 0.0007;
	if (threats[x][y][inTeam].threat > 1) {
		threats[x][y][inTeam].threat = 1;
	}
}

var npc_blue = new Array();
var npc_red = new Array();
var npc_grey = new Array();
function spawn() {
	var redCnt = 0;
	var bluCnt = 0;
	var gryCnt = 0;
	
	var spawn_blue = new Array();
	var spawn_red = new Array();
	var spawn_grey = new Array();
	
	for (var x = 0; x < gridSize.x; x++) {
		for (var y = 0; y < gridSize.y; y++) {
			addTime(0,x,y);
			addTime(1,x,y);
			addTime(2,x,y);
			if (map[x][y] == 2) {
				redCnt++;
				spawn_red.push({x:x,y:y});
			} else if (map[x][y] == 3) {
				bluCnt++;
				spawn_blue.push({x:x,y:y});
			} else if (map[x][y] == 4) {
				gryCnt++;
				spawn_grey.push({x:x,y:y});
			}
		}
	}
	var tmpPos;
	if (npc_red.length < redCnt*MaxPlyPerSquare) {
		tmpPos = spawn_red[Math.floor(spawn_red.length*Math.random())];
		npc_red.push(new npc(tmpPos,npc_blue,npc_grey));
	}
	if (npc_blue.length < bluCnt*MaxPlyPerSquare) {
		tmpPos = spawn_blue[Math.floor(spawn_blue.length*Math.random())];
		npc_blue.push(new npc(tmpPos,npc_grey,npc_red));
	}
	if (npc_grey.length < gryCnt*MaxPlyPerSquare) {
		tmpPos = spawn_grey[Math.floor(spawn_grey.length*Math.random())];
		npc_grey.push(new npc(tmpPos,npc_red,npc_blue));
	}
}

function moveTeam(inArray,inTeam) {
	var tmp = {x:0,y:0};
	var dir;
	for (var i = 0; i < inArray.length; i++) {
		tmp = {x:inArray[i].pos.x,y:inArray[i].pos.y};
		tmp.x = Math.round(tmp.x);
		tmp.y = Math.round(tmp.y);
		if (map[tmp.x][tmp.y] == 5) {
			inArray.splice(i,1);
			i--;
		} else if (inArray[i].hp <= 0) {
			inArray.splice(i,1);
			i--;
			diedAt(inTeam,{x:tmp.x,y:tmp.y});
		} else {
			dir = threats[tmp.x][tmp.y][inTeam].dir;
			inArray[i].pos.x += dir.x*npc_speed;
			inArray[i].pos.y += dir.y*npc_speed;
		}
		/*
		tmp = {x:npc_blue[i].pos.x,y:npc_blue[i].pos.y};
		tmp.x = Math.round(tmp.x);
		tmp.y = Math.round(tmp.y);
		if (map[tmp.x][tmp.y] == 1) {
			npc_blue[i].pos.x -= dir.x*npc_speed*2;
			npc_blue[i].pos.y -= dir.y*npc_speed*2;
		}
		*/
	}
}

function scan(pos1,pos2) {
	var dir = {x:pos2.x-pos1.x,y:pos2.y-pos1.y};
	mag = Math.sqrt(dir.x*dir.x+dir.y*dir.y);
	dir.x = dir.x/mag;
	dir.y = dir.y/mag;
	for (var i = 0; i < mag; i+= 0.5) {
		if (map[Math.floor(pos1.x+dir.x*i)][Math.floor(pos1.y+dir.y*i)] == 1) {
			return false;
			
		}
	}
	return true;
}

function attack(inArray, inTeam) {
	if (inArray.length > 0) {
		var cur = inArray[Math.floor(inArray.length*Math.random())];
		if (Math.random() > 0.5) {
			var tmpArray = cur.enemy1;
		} else {
			var tmpArray = cur.enemy2;
		}
		for (var i = 0; i < tmpArray.length; i++) {
			if (scan(cur.pos,tmpArray[i].pos)) {
				cur.target = tmpArray[i];
				cur.tarTime = 3;
				tmpArray[i].hp -= 10;
				killedAt(inTeam,{x:Math.floor(cur.pos.x),y:Math.floor(cur.pos.y)});
				break;
			}
		}
	}
}

var runAmt = 1;
var refresh = 0;
function runGame() {
	for (var i = 0; i < runAmt; i++) {
		//see if there needs to be anything spawned
		spawn();
		//move npcs
		moveTeam(npc_blue,1);
		moveTeam(npc_red,0);
		moveTeam(npc_grey,2);
		//have the npc's attack eachother
		for (var tmp = 0; tmp < 5; tmp++) {
			attack(npc_blue,1);
			attack(npc_red,0);
			attack(npc_grey,2);
		}
		//if there are distances to calc-ed
		if (goals[0].length > 0) {
			calcDistCycle(0);
		} else if (dirCur[0] < gridSize.x*gridSize.y) {
			calcDir(0);
		}
		
		if (goals[1].length > 0) {
			calcDistCycle(1);
		} else if (dirCur[1] < gridSize.x*gridSize.y) {
			calcDir(1);
		}
		
		if (goals[2].length > 0) {
			calcDistCycle(2);
		} else if (dirCur[2] < gridSize.x*gridSize.y) {
			calcDir(2);
		}
		refresh++;
		if (refresh > 50) {
			calcDist();
			refresh = 0;
		}
	}
}

function saveMap() {
	//draw the map
	output = "";
	lastVal = "";
	for (var x = 0; x < gridSize.x; x++) {
		for (var y = 0; y < gridSize.y; y++) {
			output += map[x][y]+":";
		}
	}
	console.log(output);
}

var startMap = "1:1:1:1:1:1:1:1:1:1:1:1:1:1:1:1:1:1:1:1:1:1:1:1:1:1:1:1:1:1:1:0:0:0:0:0:0:0:0:0:0:0:0:0:0:0:0:0:0:0:0:0:0:0:0:0:0:0:0:1:1:0:0:0:0:0:0:0:0:0:0:0:0:0:3:0:3:0:0:0:0:0:0:0:0:0:0:0:0:1:1:0:0:0:0:0:0:0:0:0:0:0:0:0:0:3:0:0:0:0:0:0:0:0:0:0:0:0:0:1:1:0:0:0:0:0:0:0:0:0:0:0:0:0:3:0:3:0:0:0:0:0:0:0:0:0:0:0:0:1:1:0:0:0:0:0:0:0:0:0:0:0:0:0:0:0:0:0:0:0:0:0:0:0:0:0:0:0:0:1:1:0:0:0:0:0:0:0:0:0:0:0:0:0:0:0:0:0:0:0:0:0:0:0:0:0:0:0:0:1:1:0:0:0:0:0:0:0:1:1:1:1:1:1:1:1:1:1:1:1:1:1:1:1:1:1:1:1:1:1:1:0:0:0:0:0:0:0:0:0:0:0:0:1:0:0:1:0:0:0:0:0:0:0:0:0:0:0:0:1:1:0:0:0:0:0:0:0:0:0:0:0:0:1:0:0:1:0:0:1:1:1:1:1:1:1:1:1:0:1:1:0:0:0:0:0:0:0:0:0:0:0:0:1:0:0:1:0:0:1:0:0:0:0:0:0:0:0:0:1:1:0:0:0:0:0:0:0:0:0:0:0:0:1:0:0:0:1:0:1:0:1:1:1:1:1:1:1:1:1:1:0:0:0:0:0:0:0:0:0:0:0:0:1:0:1:0:1:0:1:0:0:0:0:0:0:0:0:0:1:1:0:0:0:0:0:0:0:0:0:0:0:0:1:0:1:0:1:0:1:1:1:1:1:1:1:1:1:0:1:1:0:0:0:0:0:0:0:0:0:0:0:0:0:0:1:0:5:5:1:0:0:0:0:0:0:0:0:0:1:1:0:0:0:0:0:0:0:0:0:0:0:0:0:0:1:0:5:5:1:0:1:1:1:1:1:1:1:1:1:1:0:0:0:0:0:0:0:0:0:0:0:0:1:0:1:0:1:0:1:0:0:0:0:0:0:0:0:0:1:1:0:0:0:0:0:0:0:0:0:0:0:0:1:0:1:0:1:0:1:1:1:1:1:1:1:1:1:0:1:1:0:0:0:0:0:0:0:0:0:0:0:0:1:0:0:0:1:0:1:0:0:0:0:0:0:0:0:0:1:1:0:0:0:0:0:0:0:0:0:0:0:0:1:0:0:1:0:0:1:0:1:1:1:1:1:1:1:1:1:1:0:0:0:0:0:0:0:0:0:0:0:0:1:0:0:1:0:0:1:0:0:0:0:0:0:0:0:0:1:1:0:0:0:0:0:0:0:0:0:0:0:0:1:0:0:1:0:1:1:1:1:1:1:1:1:1:1:0:1:1:0:0:0:0:0:0:0:1:1:1:1:1:1:1:1:1:1:1:0:0:0:0:0:0:0:0:0:0:1:1:0:0:0:0:0:0:0:0:0:0:0:0:0:0:0:0:0:0:0:1:1:1:1:1:1:1:1:1:1:1:0:0:0:0:0:0:0:0:0:0:0:0:0:0:0:0:0:0:0:0:0:0:0:0:0:0:0:0:1:1:0:0:0:0:0:0:0:0:0:0:0:0:0:2:0:2:0:0:0:0:0:0:0:0:0:0:0:0:1:1:0:0:0:0:0:0:0:0:0:0:0:0:0:0:2:0:0:0:0:0:0:0:0:0:0:0:0:0:1:1:0:0:0:0:0:0:0:0:0:0:0:0:0:2:0:2:0:0:0:0:0:0:0:0:0:0:0:0:1:1:0:0:0:0:0:0:0:0:0:0:0:0:0:0:0:0:0:0:0:0:0:0:0:0:0:0:0:0:1:1:1:1:1:1:1:1:1:1:1:1:1:1:1:1:1:1:1:1:1:1:1:1:1:1:1:1:1:1:1"
var catMap = "0:0:0:0:0:0:0:0:0:0:0:0:0:0:0:0:0:0:0:0:0:0:0:0:0:0:0:0:0:0:0:0:0:0:0:0:0:0:0:0:0:0:0:0:0:0:0:0:0:0:0:0:0:0:0:0:0:0:0:0:0:0:0:0:0:0:0:0:0:0:0:0:0:0:0:0:0:0:0:0:0:0:0:0:0:0:0:0:0:0:0:0:0:0:0:0:1:1:1:1:1:1:0:0:0:1:1:1:1:1:1:0:0:0:0:0:0:0:0:0:0:0:0:1:1:1:0:0:0:0:0:0:1:1:1:0:0:0:0:0:0:1:1:1:0:0:0:0:0:0:0:0:1:0:0:0:0:1:0:0:0:1:0:0:0:0:0:0:0:0:0:0:0:0:1:1:0:0:0:0:0:0:0:1:0:0:0:0:1:1:0:0:0:0:0:0:0:0:0:0:1:0:1:0:0:0:1:0:0:0:0:0:0:0:1:0:0:0:1:0:0:0:0:1:1:0:0:0:0:0:1:0:1:0:0:0:0:0:0:0:0:0:0:0:0:1:1:1:1:0:0:0:1:0:0:1:0:0:0:0:1:0:1:0:0:0:0:1:0:0:0:0:0:0:0:0:0:1:0:0:0:0:1:0:1:1:0:0:0:0:1:0:1:0:0:0:0:0:1:0:0:0:0:0:0:0:0:1:0:0:0:0:1:0:0:0:0:0:0:0:0:0:0:0:1:1:0:0:1:0:0:0:0:0:0:0:0:1:0:0:0:0:1:0:0:1:0:0:0:0:0:0:0:0:0:1:0:0:1:0:0:0:0:0:0:0:1:0:0:0:0:0:0:1:1:0:0:0:0:0:1:0:0:0:0:1:0:0:0:1:0:0:0:0:0:0:1:0:0:0:0:0:0:0:0:0:0:0:0:0:1:1:0:0:0:1:0:0:0:1:0:0:0:0:0:0:0:0:0:0:0:0:0:0:0:0:0:0:0:0:1:1:1:1:1:1:0:0:0:1:0:0:0:0:0:0:0:0:0:0:0:0:0:0:0:0:0:0:0:0:1:1:1:1:1:1:0:0:0:1:0:0:0:0:0:0:1:0:0:0:0:0:0:0:0:0:0:0:0:0:1:1:0:0:0:1:0:0:0:1:0:0:0:0:0:0:1:0:0:0:0:0:0:1:1:0:0:0:0:0:1:0:0:0:0:1:0:0:0:1:0:0:0:0:0:0:0:1:0:0:0:0:1:0:0:1:0:0:0:0:0:0:0:0:0:1:0:0:1:0:0:0:0:0:0:0:0:1:0:0:0:0:1:0:1:1:0:0:0:0:0:0:0:0:1:1:0:0:1:0:0:0:0:0:0:0:0:1:0:0:0:0:1:0:0:0:0:0:0:0:1:0:1:0:0:0:0:0:1:0:0:0:0:0:0:1:1:1:1:0:0:0:1:0:0:1:0:0:0:0:1:0:1:0:0:0:0:1:0:0:0:0:0:0:1:0:0:0:1:0:0:0:0:1:1:0:0:0:0:0:1:0:1:0:0:0:0:0:0:0:0:0:0:1:0:0:0:0:1:1:0:0:0:0:0:0:0:0:0:0:1:0:1:0:0:0:1:0:0:0:0:0:1:0:0:0:0:1:0:0:0:1:0:0:0:0:0:0:0:0:0:0:0:0:1:1:0:0:0:0:0:0:0:1:1:1:0:0:0:0:0:0:1:1:1:0:0:0:0:0:0:1:1:1:0:0:0:0:0:0:0:0:0:0:0:0:1:1:1:1:1:1:1:0:0:1:1:1:1:1:1:0:0:0:0:0:0:0:0:0:0:0:0:0:0:0:0:0:0:0:0:0:0:0:0:0:0:0:0:0:0:0:0:0:0:0:0:0:0:0:0:0:0:0:0:0:0:0:0:0:0:0:0:0:0:0:0:0:0:0:0:0:0:0:0:0:0:0:0:0:0:0:0:0:0:0:0:0:0:0:0:0:0:0:0:0:0:0:0:0:0:0:0:0:0:0:0:0:0:0"

function loadMap(inMap) {
	var curMap = inMap.split(":");
	var c = 0;
	for (var x = 0; x < gridSize.x; x++) {
		for (var y = 0; y < gridSize.y; y++) {
			map[x][y] = curMap[c];
			c++;
		}
	}
}


function init() {
	canvas = document.getElementById('canvas');
	ctx = canvas.getContext('2d');

	canvas.width = 950;//window.innerWidth;
	canvas.height = 800;//window.innerHeight;
	
	ctx.fillStyle = "rgb(0,0,0)";
	ctx.fillRect(0, 0, canvas.width, canvas.height);
		
	genMap();
	loadMap(startMap);
	setInterval(drawMap, 1000/30);
	setInterval(runGame, 1000/30);
}
