window.onload = init;

//console display
//color variables
var DEFCOL = "rgb(0,200,255)"

//this will add the line to the display
function disp(inString) {
	consoleLog.unshift(inString);
	if (consoleLog.length > 100) {consoleLog.splice(100, consoleLog.length-100);}
}

consoleLog = new Array();
curOut = "Terminal Omega";
curCmd = "";

cmdHead = ">: ";
cursor = "|";

//consoleLog gradient
var logGrad;

window.addEventListener('keypress',function(evt){
	keycode = evt.keyCode;
	if (keycode != 13) {
		curCmd += String.fromCharCode(keycode);
		draw();
	}
	//event.returnValue = false;
    return false;
}, false);

window.addEventListener('keydown',function(evt){
	var key = event.keyCode || event.charCode;
	if (key == 8) {
		curCmd = curCmd.slice(0, curCmd.length-1);
		event.returnValue = false;
	} else if (key == 46) {
		curCmd = curCmd.slice(0, curCmd.length-1);
	} else if (key == 13) {
		userInput(curCmd);
	}
	draw();
	
    return false;
}, false);

function scanLine() {
	var scanDist = 2;
	//scan line
	ctx.strokeStyle = "rgb(0,0,0)";
	for (i = 0; i < canvas.height/scanDist; i++) {
		ctx.moveTo(0,i*scanDist-0.5);
		ctx.lineTo(canvas.width,i*scanDist-0.5);
	}
}

function drawLine(inString,startX,startY) {
	var split = inString.split("<");
	var sSplit;
	var cursor = 0;
	var curCol, curOut;
	
	for (var i = 0; i < split.length; i++) {
		sSplit = split[i].split(">");
		if (sSplit.length > 1) {
			if (sSplit[0] == "/") {
				curCol = DEFCOL;
			} else {
				curCol = sSplit[0];
			}
			curOut = sSplit[1];
		} else {
			curCol = DEFCOL;
			curOut = sSplit[0];			
		}
		ctx.strokeStyle = curCol;
		ctx.fillStyle = curCol;
		ctx.strokeText(curOut,startX+cursor,startY);
		ctx.fillText(curOut,startX+cursor,startY);
		cursor += ctx.measureText(curOut).width;
	}
}

var outYPos = 30;
var cmdYPos = outYPos+30;
var logYPos = cmdYPos+35;
var outCol = "rgb(0,255,200)"

function draw() {
	//clear the screen
	ctx.save();//save the scanline state
	ctx.fillStyle = "rgb(0,0,0)";
	ctx.fillRect(0, 0, canvas.width, canvas.height);
	//draw the output line 
	ctx.strokeStyle = outCol;
	ctx.font = '30px Courier New';
	ctx.strokeText(curOut,10,outYPos);
	ctx.fillStyle = outCol;
	ctx.fillText(curOut,10,outYPos);
	//draw the cmd line 
	ctx.strokeStyle = DEFCOL;
	ctx.font = '30px Courier New';
	ctx.strokeText(cmdHead+curCmd+cursor,10,cmdYPos);
	ctx.fillStyle = DEFCOL;
	ctx.fillText(cmdHead+curCmd+cursor,10,cmdYPos);
	//draw the console log
	for (var i = 0; i < consoleLog.length; i++) {
		drawLine(consoleLog[i],65,logYPos+30*i);
	}
	ctx.restore();//restore to the scanline state
	//draw the fade
	ctx.fillStyle = logGrad;
	ctx.fillRect(0, 0, canvas.width, canvas.height);
	//draw the scan lines
	ctx.stroke();
	
}

var curBlink = true;
function blink() {//causes the cursor to blink
	if (curBlink) {
		cursor = " ";
	} else {
		cursor = "|";
	}
	curBlink = !curBlink;
	draw();
}

function init() {
	//Grab the Canvas tag from index.html
	canvas = document.getElementById('canvas');
	//Create an interface for interacting with canvas in 2D
	ctx = canvas.getContext('2d');

	//Set the dimensions of the canvas to match the broser window
	//Note that global.css helps make this possible
	canvas.width = window.innerWidth;
	canvas.height = window.innerHeight;
	
	//settup the log gradient
	logGrad = ctx.createLinearGradient(0,0,0,canvas.height);
	logGrad.addColorStop(0,"rgba(0,100,100,0.01)");
	logGrad.addColorStop(1,"rgba(0,0,0,0.8)");
	
	scanLine();
	draw();
	//blinking line
	setInterval(blink, 1000);//blink every second
}