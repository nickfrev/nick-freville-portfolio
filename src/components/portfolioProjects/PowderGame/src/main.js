window.onload = init;

var mouseDown = false;
var mode = true;
var mx = 0, my = 0;
var curNode = 0;
var maxNodes = 5;

window.addEventListener('mousedown', function(evt) {
	mouseDown = true;
}, false);
window.addEventListener('mouseup', function(evt) {
	mouseDown = false;
}, false);
window.addEventListener('mousemove', function(evt) {
	mx = evt.offsetX/plane.resX;
	my = evt.offsetY/plane.resY;
}, false);
window.addEventListener("keydown", function(evt) {
        //alert("keydown: " + evt.keyCode);
	if (evt.keyCode == 38) {
		//up
		if (curNode < maxNodes-1) {
			curNode++;
		}
	} else if (evt.keyCode == 40) {
		//down
		if (curNode > 0) {
			curNode--;
		}
	} else if (evt.keyCode == 39) {
		//right
		mode = true;
	} else if (evt.keyCode == 37) {
		//left
		mode = false;
	} else {
		return;
	}
	evt.stopPropagation();
	evt.preventDefault();
}, false);

////////////////////////////////////////////////////////////////////////////////////
var fps = 0;

function getFps() {
	context.fillStyle = "rgb(0,0,0)";
	context.fillRect(10, 10, 60, 50);
	context.strokeText(fps,10,50);
	fps = 0;
}


function mainTest(){
	fps++;
	size = 3;
	if (mouseDown) {
		if (mode) {
			for (x = mx-size; x < mx+size; x++) {
				for (y = my-size; y < my+size; y++) {
					if (curNode == 0) {
						plane.addNode({x:Math.floor(x),y:Math.floor(y)},true,new powder());
					} else if (curNode == 1) {
						plane.addNode({x:Math.floor(x),y:Math.floor(y)},true,new soil());
					} else if (curNode == 2) {
						plane.addNode({x:Math.floor(x),y:Math.floor(y)},true,new snow());
					} else if (curNode == 3) {
						plane.addNode({x:Math.floor(x),y:Math.floor(y)},true,new water());
					} else if (curNode == 4) {
						plane.addNode({x:Math.floor(x),y:Math.floor(y)},true,new grass());
					}
				}
			}
		} else {
			for (x = mx-size; x < mx+size; x++) {
				for (y = my-size; y < my+size; y++) {
					if (plane.chkNode({x:Math.floor(x),y:Math.floor(y)}) != null) {
						plane.chkNode({x:Math.floor(x),y:Math.floor(y)}).setForce({x:0.03,y:-0.05});
					}
					//plane.remNode(plane.chkNode({x:Math.floor(x),y:Math.floor(y)}));
				}
			}
		}
	}
	
	plane.tick(3);
	plane.draw();  
}
////////////////////////////////////////////////////////////////////////////////////


var plane;
/*
var powder = function() {
	this.name = "DEFAULT";
	this.type = "hi";
}

var sand = function() {
	this.type = "hello";
	this.cat = 5;
}
sand.prototype = new powder();

tmp1 = new powder();
alert(tmp1.name);//DEFAULT
alert(tmp1.type);//hi

tmp2 = new sand();
alert(tmp2.name);//DEFAULT
alert(tmp2.type);//hello
alert(tmp2.cat);//5
*/
//richillicious
//http://youtu.be/KVKiZMROElQ?t=14m37s
function loadMap() {
	//soil
	for (x = 1; x < 130; x+=1) {
		for (y = 150; y < 160; y+=1) {
			plane.addNode({x:x,y:y},true,new soil());
		}
	}
	
	for (x = 250; x < 400; x+=1) {
		for (y = 150; y < 160; y+=1) {
			plane.addNode({x:x,y:y},true,new soil());
		}
	}
	//sand
	for (x = 140; x < 240; x+=1) {
		for (y = 150; y < 155; y+=1) {
			plane.addNode({x:x,y:y},true,new sand());
		}
	}
	//water
	for (x = 140; x < 240; x+=1) {
		for (y = 130; y < 135; y+=1) {
			plane.addNode({x:x,y:y},true,new water());
		}
	}
	//grass
	for (x = 1; x < 125; x+=1) {
		for (y = 145; y < 147; y+=1) {
			plane.addNode({x:x,y:y},true,new grass());
		}
	}
	
	for (x = 255; x < 400; x+=1) {
		for (y = 145; y < 147; y+=1) {
			plane.addNode({x:x,y:y},true,new grass());
		}
	}
}

function init()
{
	canvas = document.getElementById('canvas');
	context = canvas.getContext('2d');
	
	canvas.width = window.innerWidth;
	canvas.height = window.innerHeight;

	context.clearRect(0, 0, canvas.width, canvas.height);

	context.fillStyle = "rgb(0,0,0)";

	context.fillRect(0, 0, canvas.width, canvas.height);
	
	plane = new world(400,200);//make the plane
	plane.startWorld();//start the plane world

	var tmpx;
	var tmpy;
	
	//make the map
	for (i = 0; i < plane.width; i+=1) {
		plane.addNode({x:i,y:plane.height-4},false,new solid());
	}
	for (i = 0; i < 100; i+=1) {
		plane.addNode({x:0,y:plane.height-4-i},false,new solid());
		plane.addNode({x:plane.width-1,y:plane.height-4-i},false,new solid());
	}
	
	loadMap();
	
	context.strokeStyle = "rgb(0,255,0)";
	context.font="30px Arial";
	//setInterval(run, 1000/120);
	setInterval(getFps, 1000/1);
	setInterval(mainTest, 1000/120);
}