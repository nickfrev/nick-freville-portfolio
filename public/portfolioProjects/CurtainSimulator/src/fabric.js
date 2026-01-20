
physicsTick = 30;
pix2Met = 3779;
nodes = [];
edges = [];
var mouseLas = {x:0,y:0};
var allowNodes = true;

//var width = 50;
//var height = 50;
//var space = 5;
var botScreen;
var mouseClick = false;
window.addEventListener('mousedown', function(evt) {
	mouseClick = true;
}, false);

window.addEventListener('mouseup', function(evt) {
	mouseClick = false;
}, false);
window.addEventListener("keydown", function(evt) {
        //alert("keydown: " + evt.keyCode);
	if (evt.keyCode == 82) {
		startFabric();
	} else if (evt.keyCode == 84 && allowNodes) {
		fabInfo.drawNodes = !fabInfo.drawNodes;
	} else if (evt.keyCode == 38) {
		//up a level
		if (curLevelNum < maxLevel) {
			curLevelNum++;
		}
		curLevel = level[curLevelNum];
	} else if (evt.keyCode == 40) {
		//down a level
		if (curLevelNum > 0) {
			curLevelNum--;
		}
		curLevel = level[curLevelNum];
	}
}, false);

window.addEventListener('mousemove', function(evt) {
	if (mouseLas.x == 0 && mouseLas.x == 0) {
		mouseLas.x = evt.clientX;
		mouseLas.y = evt.clientY;
	}
	if (!mouseClick) {
		var force;
		var fiffx, fiffy;
		var diffx, diffy;
		var dist;
		fiffx = (evt.clientX-mouseLas.x)/200*curLevel[7];
		fiffy = (evt.clientY-mouseLas.y)/200*curLevel[7];
		for (var i = 0; i < nodes.length; i++) {
			if (nodes[i].frozen == false) {
				diffx = evt.clientX-nodes[i].pos.x;
				diffy = evt.clientY-nodes[i].pos.y;
				dist = Math.sqrt(diffx*diffx+diffy*diffy);
				if (dist < curLevel[6]) {
					nodes[i].curForce.x += fiffx*(dist/curLevel[6]);
					nodes[i].curForce.y += fiffy*(dist/curLevel[6]);
				}
			}
		}
		
	}
	mouseLas.x = evt.clientX;
	mouseLas.y = evt.clientY;
      }, false);
	  
function drawFabric() {
	
	if (fabInfo.drawNodes && allowNodes) {
		for (var i = 0; i < nodes.length; i++) {
			context.fillStyle = nodes[i].color;
			//draw the point
			context.beginPath();
			context.arc(nodes[i].pos.x,nodes[i].pos.y,fabInfo.nodeSize,0,2*Math.PI);
			context.fill();
		}
	}
	
	context.beginPath();
	if (fabInfo.drawEdges || !allowNodes || !fabInfo.drawNodes) {
		context.strokeStyle = "rgba(255,255,255,0.5)";
		
		var pos1, pos2;
		for (var i = 0; i < edges.length; i++) {
			//draw the edge
			pos1 = nodes[edges[i].left].pos;//first nodes pos
			pos2 = nodes[edges[i].right].pos;//second nodes pos
			
			context.moveTo(pos1.x,pos1.y);
			context.lineTo(pos2.x,pos2.y);
			
		}
		
	}
	context.stroke();
}

function calcFabric() {
	if (mouseClick) {
		addHole();
	}
	//update positions
	var ax, ay;
	var time = 1/physicsTick;
	bounceVal = 0.1;
	for (var i = 0; i < nodes.length; i++) {
		if (nodes[i].frozen == false) {
			//check for collisions
			//x direction
			if (nodes[i].pos.x < container.start.x) {
				nodes[i].pos.x = container.start.x;
				nodes[i].curVel.x = nodes[i].curVel.x*-0.5;
				nodes[i].curForce.x = nodes[i].curForce.x*-0.5;
			}
			if (nodes[i].pos.x > container.stop.x) {
				nodes[i].pos.x = container.stop.x;
				nodes[i].curVel.x = nodes[i].curVel.x*-0.5;
				nodes[i].curForce.x = nodes[i].curForce.x*-0.5;
			}
			//Y direction
			
			if (nodes[i].pos.y < container.start.y && nodes[i].curVel.y < -bounceVal) {
				nodes[i].pos.y = container.start.y;
				nodes[i].curVel.y = nodes[i].curVel.y*-0.5;
				nodes[i].curForce.y = nodes[i].curForce.y*-0.5;
			}  else if (nodes[i].pos.y < container.start.y && nodes[i].curVel.y > -bounceVal) {
				nodes[i].pos.y = container.start.y;
				nodes[i].curVel.y = 0;
			} else if (nodes[i].pos.y > container.stop.y && nodes[i].curVel.y > bounceVal) {
				nodes[i].pos.y = container.stop.y;
				nodes[i].curVel.y = nodes[i].curVel.y*-0.5;
				nodes[i].curForce.y = nodes[i].curForce.y*-0.5;
			} else if (nodes[i].pos.y > container.stop.y && nodes[i].curVel.y < bounceVal) {
				nodes[i].pos.y = container.stop.y;
				nodes[i].curVel.y = 0;
			}
			
			//get the acceleration using f = ma
			ax = nodes[i].curForce.x/nodes[i].mass;
			ay = nodes[i].curForce.y/nodes[i].mass;
			nodes[i].curVel.x += ax*time;
			nodes[i].curVel.y += ay*time;
			
			//add air resistance
			nodes[i].curVel.x = nodes[i].curVel.x*0.99;
			nodes[i].curVel.y = nodes[i].curVel.y*0.99;
			
			//set the pos
			nodes[i].pos.x += nodes[i].curVel.x*time*pix2Met;
			nodes[i].pos.y += nodes[i].curVel.y*time*pix2Met;
		}
	}
	
	for (var i = 0; i < nodes.length; i++) {
		//add gravity for each node
		nodes[i].curForce.x = 0;
		nodes[i].curForce.y = 0.01;//nodes[i].mass;
	}
	
	var pos1, pos2;
	var diffx, diffy, dirx, diry;
	var str = 6;
	for (var i = 0; i < edges.length; i++) {
		//calculate the force for each edge
		pos1 = nodes[edges[i].left].pos;//first nodes pos
		pos2 = nodes[edges[i].right].pos;//second nodes pos
		diffx = pos2.x-pos1.x;
		diffy = pos2.y-pos1.y;
		
		dist = Math.sqrt(diffx*diffx+diffy*diffy);
		
		dirx = diffx/dist;
		diry = diffy/dist;
		if (dist > edges[i].len+80) {
			edges.splice(i, 1);
		} else if (dist > edges[i].len) {
			nodes[edges[i].left].curForce.x += dirx*(dist-edges[i].len)*time*nodes[edges[i].left].mass*str;
			nodes[edges[i].left].curForce.y += diry*(dist-edges[i].len)*time*nodes[edges[i].left].mass*str;
			
			nodes[edges[i].right].curForce.x -= dirx*(dist-edges[i].len)*time*nodes[edges[i].right].mass*str;
			nodes[edges[i].right].curForce.y -= diry*(dist-edges[i].len)*time*nodes[edges[i].right].mass*str;
			
			if (!nodes[edges[i].left].frozen) {
				nodes[edges[i].left].pos.x = nodes[edges[i].right].pos.x-dirx*edges[i].len;
				nodes[edges[i].left].pos.y = nodes[edges[i].right].pos.y-diry*edges[i].len;
			}
			//if (!nodes[edges[i].right].frozen && !flop) {
			//	nodes[edges[i].right].pos.x = nodes[edges[i].left].pos.x+dirx*edges[i].len;
			//	nodes[edges[i].right].pos.y = nodes[edges[i].left].pos.y+diry*edges[i].len;
			//}
		}
	}
}

function run() {
	calcFabric();
	drawFabric();
}
