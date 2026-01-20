//width,height,space,nodeSize,drawnodes,drawEdges,forcesize,forcepower(multiplier),
//	color[horizontal?,[position(%/100),r,g,b]...], clickTool[index,neededVars], name, [background image, foreground image], x of curtain, y of curtain, type of curtain, name of tool,
//  music path
var level = [
[54,54,5,5,false,true,50,3,[true,[0,255,0,0,0.25],[0.5,0,0,255,0.25],[1,0,255,0,0.25]],[0,1],"Tutorial",["background/Tutorial.png"],153,85,0,"Black-Hole","WinterChimes.mp3","Winter Chimes"],
[27,27,10,5,false,true,50,1,[true,[0,255,0,0,0.25],[0.5,0,0,255,0.25],[1,0,255,0,0.25]],[0,1],"Abstract",["background/Abstract.png"],153,85,0,"Black-Hole","InnerLight.mp3","Inner Light"],
[53,55,5,5,true,true,50,1,[true,[0,0,250,255,0.25],[1,250,0,255,0.25]],[0,-100],"Techno Bomb",["background/TechnoBomb.png"],360,70,0,"Explosion","GoCart.mp3","Go Cart"],
[42,42,8,5,true,true,50,1,[true,[0,255,0,0,0.75]],[0,10],"Slaughter House",["background/Slaughterhouse.png"],325,60,0,"Slaughter-Hole","TenebrousBrothersCarnival_ActOne.mp3","Tenebrous Brothers Carnival - Act One"],
// [50,52,8,10,true,false,50,1,[true,[0,139,69,19,0.25]],[0,-7],"Sh*t House",["background/ShtHouse.png"],305,120,0,"Breaking Wind","BattyMcFaddin.mp3", "Batty McFaddin"],
[40,40,5,5,true,true,10,100,[true,[0,255,0,255,0.25],[1,0,250,255,0.25]],[0,1],"Techno Ninja",["background/TechnoNinja.png"],625,215,0,"Black-Hole","Electrodoodle.mp3", "Electrodoodle"],
[40,40,10,5,true,true,25,2,[true,[0,0,255,255,0.5],[1,0,0,255,0.25]],[0,1],"Shower",["background/Shower.png"],110,130,0,"Black-Hole","DanseMorialta.mp3", "Danse Morialta"],
];
var maxLevel = 6;

function getColor(x, y, color) {
	if (color.length < 2) {
		return "rgba(255,255,255,0.25)";
	} else if (color.length == 2) {
		return ("rgba("+Math.round(color[1][1])+","+Math.round(color[1][2])+","+Math.round(color[1][3])+","+color[1][4]+")");
	} else {
		if (!color[0]) {
			var t = x;
			x = y;
			y = t;
		}
		var top = 2, bot = 1, curPos;
		curPos = y/fabInfo.height;
		for (var i = 1; i < color.length; i++) {
			if (curPos < color[i][0]) {
				bot = i-1;
				top = i;
				break;
			}
		}
		if (bot == 0) {
			return ("rgba("+Math.round(color[top][1])+","+Math.round(color[top][2])+","+Math.round(color[top][3])+","+color[top][4]+")");
		}
		//alert("rgba("+Math.round(color[bot][1])+","+Math.round(color[bot][2])+","+Math.round(color[bot][3])+","+color[bot][4]+")");
		var dist = color[top][0]-color[bot][0];
		var perTop = (curPos-color[bot][0])/dist;
		var perBot = 1-perTop;
		var r,g,b,a;
		r = Math.round(color[top][1]*perTop+color[bot][1]*perBot);
		g = Math.round(color[top][2]*perTop+color[bot][2]*perBot);
		b = Math.round(color[top][3]*perTop+color[bot][3]*perBot);
		a = color[top][4]*perTop+color[bot][4]*perBot;
		return ("rgba("+r+","+g+","+b+","+a+")");

	}

}

function startFabric() {
	botScreen = (canvas.height-10);
	var width = fabInfo.width;
	var height = fabInfo.height;

	var edgeCnt = 0;

	//send errors
	if (curLevel[8].length < 2) {
		alert("Error in color Code");
	}
	if (curLevel[14] == 0) {
		for (var x = 0; x < fabInfo.width; x++) {
			for (var y = 0; y < fabInfo.height; y++) {
				nodes[x*height+y] = {
					pos:{x:x*fabInfo.space+fabInfo.start.x, y:y*fabInfo.space+fabInfo.start.y},
					curForce: {x:0, y:0},
					curVel: {x:-0.01, y:0},
					mass: 0.1,
					frozen: false,
					color:getColor(x,y,curLevel[8])//"rgba("+Math.floor((y)*5)+","+Math.floor(255-(y)*5)+",255,0.25)"//"rgba(139,69,19,0.25)"//
				}
				if (y == 0) {
					nodes[x*height+y].frozen = true;
				}
				if (y != 0) {
					edges[edgeCnt] = {
						left: x*height+y,
						right: x*height+y-1,
						len: fabInfo.space
					}
					edgeCnt++;
				}
				if (x != 0 && x != Math.floor(width/2)) {
					edges[edgeCnt] = {
						left: x*height+y,
						right: (x-1)*height+y,
						len: fabInfo.space
					}
					edgeCnt++;
				}
			}
		}
	} else if (curLevel[14] == 1) {

	}
}

function addHole() {
	var force;
	var fiffx, fiffy;
	var diffx, diffy;
	var dist;
	if (curLevel[9][0] == 0) {//Gravity force [0,Gravity Force inwards]
		for (var i = 0; i < nodes.length; i++) {
			if (nodes[i].frozen == false) {
				diffx = mouseLas.x-nodes[i].pos.x;
				diffy = mouseLas.y-nodes[i].pos.y;
				dist = Math.sqrt(diffx*diffx+diffy*diffy);

				nodes[i].curForce.x += diffx/(dist*dist)*curLevel[9][1];
				nodes[i].curForce.y += diffy/(dist*dist)*curLevel[9][1];
			}
		}
	}
}
