
window.onload = init;

var size = 6;
var cellSize = size+2;
var steps = 5;
var speed = 100;//iterations per frame
var port = {x:30,y:30,width:100,height:50};

var runPerc = 0.6;
var nodeNum = 5;
var nodeList = new Array(nodeNum);
var data;
var freeCells;

function dist(vec1, vec2) {
	var x = vec1.x-vec2.x;
	var y = vec1.y-vec2.y;
	return Math.sqrt(x*x+y*y);
}

function check(inPos, inDir) {
	var x = Math.round((inPos.x)+inDir.x);
	var y = Math.round((inPos.y)+inDir.y);
	if (x < port.width & x >= 0 & y < port.height & y >= 0) {
		if (data[x][y]) {return true;}
		if (data[x][Math.round(inPos.y)] && data[Math.round(inPos.x)][y]) {return true;}
	} else {
		return true;
	}
	return false;
}

function set(inPos, inVal) {
	var x = Math.round(inPos.x);
	var y = Math.round(inPos.y);
	if (x < port.width & x >= 0 & y < port.height & y >= 0) {
		if (!data[x][y] && inVal == true) {
			setCnt++;
		}
		data[x][y] = inVal;
		
	}
	
}

node = function(inX,inY) {
	this.alive = true;
	this.pos = {x:inX,y:inY};
	this.dir = {x:0,y:0};
	this.sleep = Math.round(70*Math.random());
	this.tick = function() {
		if (this.sleep > 0) {
			this.sleep--;
			if (this.sleep < 2) {
				this.sleep = 0;
				this.dir = this.getDir();
			}
		} else {
			if (this.dir.x == 0 && this.dir.y == 0) {
				this.alive = false;
			}
			if (!check(this.pos,this.dir)) {
				set(this.pos,true);
				this.pos.x += this.dir.x*(1/steps);
				this.pos.y += this.dir.y*(1/steps);
			} else {
				this.pos.x = Math.round((this.pos.x));
				this.pos.y = Math.round((this.pos.y));
				set(this.pos,true);
				this.sleep = 10;
			}
		}
		ctx.beginPath();
		ctx.arc(port.x+(this.pos.x*cellSize),port.y+(this.pos.y*cellSize),size/3,0,2*Math.PI);
		ctx.stroke();
	}
	this.getDir = function() {
		cur = Math.round(7*Math.random());
		for (q = 0; q < this.cCnt; q++) {
			if (!check(this.pos,this.choise[(q+cur)%this.cCnt])) {
				return this.choise[(q+cur)%this.cCnt];
			}
		}
		return {x:0,y:0};
	}
	this.choise = new Array();
	this.choise[0] = {x:0,y:1};
	this.choise[1] = {x:1,y:0};
	this.choise[2] = {x:0,y:-1};
	this.choise[3] = {x:-1,y:0};
	this.choise[4] = {x:1,y:1};
	this.choise[5] = {x:1,y:-1};
	this.choise[6] = {x:-1,y:-1};
	this.choise[7] = {x:-1,y:1};
	this.cCnt = this.choise.length;
	//mix them
	this.mix = function() {
		for (q = 0; q < 10; q++) {
			index1 = Math.round((this.cCnt-1)*Math.random());
			index2 = Math.round((this.cCnt-1)*Math.random());
			tmp = this.choise[index1];
			this.choise[index1] = this.choise[index2];
			this.choise[index2] = tmp;
		}
	}
}

function makeArray() {
	//make the grid
	data = new Array(port.width);
	for (x = 0; x < port.width; x++) {
		data[x] = new Array(port.height);
		for (y = 0; y < port.height; y++) {
			data[x][y] = false;
		}
	}
	//make the nodes
	for (i = 0; i < nodeNum; i++) {
		nodeList[i] = new node(Math.round((port.width-1)*Math.random()),Math.round((port.height-1)*Math.random()));
		nodeList[i].mix();
	}
	//create the free cell array
	freeCells = new Array();
	max = port.width*port.height-1;
	for (i = 0; i < max; i++) {
		freeCells[i] = i;
	}
	console.log(freeCells);
		//mix it
		for (q = 0; q < max; q++) {
			index1 = Math.round(max*Math.random());
			index2 = Math.round(max*Math.random());
			tmp = freeCells[index1];
			freeCells[index1] = freeCells[index2];
			freeCells[index2] = tmp;
		}
}

var running = true;
var setCnt = 0;
function run() {
	requestAnimationFrame(run);
	//ctx.fillStyle = "rgb(0,0,0)";
	//ctx.fillRect(0, 0, canvas.width, canvas.height);
	if (setCnt/(port.width*port.height) > runPerc) {
		running = false;
		//console.log("perc Reached");
	}
	for (t = 0; t < speed; t++) {
		for (i = 0; i < nodeNum; i++) {
			if (nodeList[i].alive) {
				nodeList[i].tick();
			} else if (running) {
				//find a new spot for it
				for (q = 0; q < 1; q++) {
					if (freeCells.length < 2) {
						running = false;
					}
					cur = freeCells.shift();
					curX = cur%port.width;
					curY = Math.floor(cur/port.width);
					if (!isNaN(cur)) {
						if (!data[curX][curY]) {
							nodeList[i].pos = {x:curX,y:curY};
							nodeList[i].alive = true;
							nodeList[i].sleep = 10;
							break;
						}
					}
				}
				//rndX = Math.round(port.width*Math.random());
				//rndY = Math.round(port.width*Math.random());
				//for (x = 0; x < port.width; x++) {
				//	for (y = 0; y < port.height; y++) {
				//		if (!data[(x+rndX)%port.width][(y+rndY)%port.height]) {
				//			//if it finds an empty spot place the node
				//			nodeList[i].pos = {x:(x+rndX)%port.width,y:(y+rndY)%port.height};
				//			nodeList[i].alive = true;
				//		}
				//	}
				//}
				//if (x == port.width-1 && y == port.height-1) {
				//	running = false;
				//}
			}
		}
	}
	//ctx.strokeStyle = "rgba(255,0,255,0.5)";
	//for (x = 0; x < port.width; x++) {
	//	for (y = 0; y < port.height; y++) {
	//		if (!data[x][y]) {
	//			ctx.beginPath();
	//			ctx.arc(port.x+(x*size),port.y+(y*size),size/2,0,2*Math.PI);
	//			ctx.stroke();
	//		}
	//	}
	//}
}

function init() {
	//Grab the Canvas tag from index.html
	canvas = document.getElementById('canvas');
	//Create an interface for interacting with canvas in 2D
	ctx = canvas.getContext('2d');

	canvas.width = window.innerWidth;
	canvas.height = window.innerHeight;

	ctx.fillStyle = "rgb(0,0,0)";
	ctx.fillRect(0, 0, canvas.width, canvas.height);
	
	//make the port full screen
	port.width = Math.floor((canvas.width-2*port.x)/cellSize);
	port.height = Math.floor((canvas.height-2*port.y)/cellSize);
	
	ctx.strokeStyle = "rgba(0,255,255,0.5)";
	makeArray();
	run();
	//intervalID = setInterval(run, 1000/60);
}
	