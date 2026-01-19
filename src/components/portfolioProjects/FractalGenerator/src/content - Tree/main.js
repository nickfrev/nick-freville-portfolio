window.onload = init;

var fracs = new Array();

frac = function(inPos, inDir, inScale, inCurVal) {
	this.pos = inPos;//{x:0,y:0};
	
	this.scale = inScale;
	
	this.curVal = inCurVal;
	
	this.dir = {x:Math.sin(this.curVal),y:-Math.cos(this.curVal)};;//inDir;//{x:0,y:0};
	
	this.normalize = function(inVec) {
		var dist = Math.sqrt(inVec.x*inVec.x+inVec.y+inVec.y);
		return {x:inVec.x/dist,y:inVec.y/dist};
	}
	
	this.draw = function() {
		
		ctx.beginPath();
		ctx.moveTo(this.pos.x,this.pos.y);
		ctx.lineTo(this.pos.x+this.dir.x*this.scale,this.pos.y+this.dir.y*this.scale);
		ctx.stroke();
	}
	this.addChildren = function(inArray) {
		var tempPos = {x:this.pos.x+this.dir.x*this.scale/1,
						y:this.pos.y+this.dir.y*this.scale/1};
						
		inArray.push(new frac({x:tempPos.x,y:tempPos.y}, {x:0,y:0}, this.scale/1.1, this.curVal-0.3));
		inArray.push(new frac({x:tempPos.x,y:tempPos.y}, {x:0,y:0}, this.scale/1.1, this.curVal+0.3));
		//inArray.push(new frac({x:tempPos.x,y:tempPos.y}, {x:0,y:0}, this.scale/2, this.curVal+1.5));
		//inArray.push(new frac({x:tempPos.x,y:tempPos.y}, {x:this.dir.x,y:this.dir.y}, this.scale/1.8));
		
	}
}


var cycles = 10;
var cur = 0;
function draw() {
	if (cur < cycles) {
		//draw the current current lines
		ctx.strokeStyle = "rgba("+Math.round(255-cur*(255/10))+","+Math.round(cur*(255/10))+",255,1)";
		ctx.lineWidth = 21-cur*2;
		for (var i = 0; i < fracs.length; i++) {
			fracs[i].draw();
		}
		//settup the new fractals
		var temp = new Array();
		for (var i = 0; i < fracs.length; i++) {
			fracs[i].addChildren(temp);
		}
		
		fracs = temp;
		
		cur++;
	}
}

function init() {
	canvas = document.getElementById('canvas');
	ctx = canvas.getContext('2d');

	canvas.width = window.innerWidth;
	canvas.height = window.innerHeight;
	
	ctx.fillStyle = "rgba(0,0,0,1)";
	ctx.fillRect(0, 0, canvas.width, canvas.height);
	
	fracs.push(new frac({x:600,y:800}, {x:0,y:-1}, 100, 0));
	
	setInterval(draw, 1000/2);
}