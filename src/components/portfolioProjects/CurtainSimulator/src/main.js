window.onload = init;

var curLevel;
var lasLevelNum;
var curLevelNum;
var allowMusic = true;

function mainLoop() {
	if (lasLevelNum != curLevelNum) {
		$("#curGameName").html(level[curLevelNum][10]+"<br><u>Mouse Click:</u> "+curLevel[15]+"<br><u>Music: </u>"+curLevel[17]+" <br> Music By Kevin MacLeod (<a href='http://www.incompetech.com' target='_blank'>incompetech.com</a>) <br> Art By: <a href='http://cargocollective.com/jasonchadwick' target='_blank'>Jason Chadwick</a>");
		nodes = [];
		edges = [];
		lasLevelNum = curLevelNum;
		getSceneSize();
		startFabric();
		context.fillStyle = "rgb(0,0,0)";
		context.fillRect(0, 0, canvas.width, canvas.height);
	}
	calcFabric();
	
}

function drawLoop() {
	drawScene();
	drawFabric();
	//run();
	if (curLevel[11].length > 1) {
		context.drawImage(foregroundImg, container.start.x, container.start.y, container.width, container.height);
	}
	window.requestAnimationFrame(drawLoop);
}

function init()
{
	//Grab the Canvas tag from index.html
	canvas = document.getElementById('canvas');
	//Create an interface for interacting with canvas in 2D
	context = canvas.getContext('2d');
	//var ctx = document.getCSSCanvasContext("2d", "squares", w, h);
	
	//Set the dimensions of the canvas to match the broser window
	//Note that global.css helps make this possible
	canvas.width = window.innerWidth;
	canvas.height = window.innerHeight;
	
	//context = document.getCSSCanvasContext("2d", "curSim2013", canvas.width, canvas.height);
	//Erase the contents of the canvas
	context.clearRect(0, 0, canvas.width, canvas.height);

	//Set the color of all vector drawings to black
	context.fillStyle = "rgb(0,0,0)";

	//Draw a filled rectangle the size of the width and height of the canvas
	context.fillRect(0, 0, canvas.width, canvas.height);
	
	curLevel = level[1];
	curLevelNum = 1;
	lasLevelNum = -1;
	
	//setInterval(run, 1000/120);
	setInterval(mainLoop, 1000/30);
	window.requestAnimationFrame(drawLoop);
}