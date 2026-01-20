
var mousePos = {x:0,y:0};
window.addEventListener('mousemove', function(evt) {
	mousePos.x = evt.clientX;
	mousePos.y = evt.clientY;
}, false);

function getDir(curPos,tarPos) {
	var dir = {x:tarPos.x-curPos.x,y:tarPos.y-curPos.y};
	var dist = Math.sqrt(dir.x*dir.x+dir.y*dir.y);
	if (dist != 0) {
		return {x:dir.x/dist,y:dir.y/dist};
	}
	return {x:0,y:0};
}

function getDist(curPos,tarPos) {
	var dir = {x:tarPos.x-curPos.x,y:tarPos.y-curPos.y};
	var dist = Math.sqrt(dir.x*dir.x+dir.y*dir.y);
	return dist;
}

ply = function() {
	this.pos = {x:100,y:100};
	
	this.tailLength = 5;
	this.tail = new Array();
	
	for (var i = 0; i < this.tailLength; i++) {
		this.tail[i] = {x:0,y:0};
	}
	
	this.move = function(inPos) {
		this.pos = inPos;
		if (getDist(this.pos,{x:canvas.width/2,y:canvas.height/2}) < 150) {
			var tmpDir = getDir(this.pos,{x:canvas.width/2,y:canvas.height/2});
			this.pos.x = canvas.width/2-tmpDir.x*150;
			this.pos.y = canvas.height/2-tmpDir.y*150;
		}
		//move the tail
		if (this.tailLength > 0) {
			var basePos = this.pos;
			var tmpDir = getDir(basePos,this.tail[0]);
			this.tail[0] = {x:basePos.x+tmpDir.x*18,y:basePos.y+tmpDir.y*18};
			for (var i = 1; i < this.tailLength; i++) {
				basePos = this.tail[i-1];
				tmpDir = getDir(basePos,this.tail[i]);
				this.tail[i] = {x:basePos.x+tmpDir.x*((8-i)*2),y:basePos.y+tmpDir.y*((8-i)*2)};
			}
		}
		
	}
	
	this.draw = function() {
		ctx.beginPath();
		ctx.lineWidth = 3;
		ctx.strokeStyle = "#00FFFF";
		ctx.arc(this.pos.x,this.pos.y,10,0,2*Math.PI);
		//draw the tail
		var pos = {x:0,y:0};
		for (var i = 0; i < this.tailLength; i++) {
			pos = this.tail[i];
			ctx.moveTo(pos.x+8-i,pos.y);
			ctx.arc(pos.x,pos.y,8-i,0,2*Math.PI);
		}
		
		ctx.stroke();
	}
}

Engine = function() {	
	this.objects = new Array();
	this.width = canvas.width;
	this.height = canvas.height;
	
	//settup the player
	this.ply = new ply();
	
	
	this.addObj = function(obj) {
		obj.myEng = this;
		obj.onLive();
		this.objects.push(obj);
	}
	
	this.tick = function() {
		//ctx.fillStyle = "rgb(0,1,0)";
		ctx.fillStyle = "rgba(0, 0, 0, 0.5)";
		ctx.fillRect(0, 0, canvas.width, canvas.height);
		
		for (var i = 0; i < this.objects.length; i++) {
			var curObj = this.objects[i];
			if (!curObj.alive || !curObj.isInBounds(this.width,this.height)) {
				//curObj.setDead();
				this.objects.splice(i, 1);
				i--;
			} else {
				curObj.logic();
				curObj.draw();
			}
		}
		
		this.ply.move(mousePos);
		this.ply.draw();
	}
}
