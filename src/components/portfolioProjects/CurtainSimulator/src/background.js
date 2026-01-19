container = {
	width: 0,
	height: 0,
	start: { x: 0, y: 0 },
	stop: { x: 0, y: 0 },
};

fabInfo = {
	width: 0,
	height: 0,
	start: { x: 0, y: 0 },
	stop: { x: 0, y: 0 },
};

var backgroundImg = new Image();
var foregroundImg = new Image();
var myAudio = new Audio();

function getSceneSize() {
	container.width = 1000; //
	container.height = container.width / 1.62;

	container.start.x = window.innerWidth / 2 - container.width / 2;
	if (container.start.x < 0) {
		container.start.x = 0;
	}
	container.start.y = window.innerHeight / 2 - container.height / 2;
	if (container.start.y < 0) {
		container.start.y = 0;
	}
	container.stop.x = container.start.x + container.width;
	container.stop.y = container.start.y + container.height;

	fabInfo.start.x = container.start.x + curLevel[12];
	fabInfo.start.y = container.start.y + curLevel[13];

	fabInfo.width = curLevel[0];
	fabInfo.height = curLevel[1];
	fabInfo.space = curLevel[2];
	fabInfo.nodeSize = curLevel[3];
	fabInfo.drawNodes = curLevel[4];
	fabInfo.drawEdges = curLevel[5];

	fabInfo.stop.x = fabInfo.start.x + fabInfo.width * fabInfo.space;
	fabInfo.stop.y = fabInfo.start.y + fabInfo.height * fabInfo.space;

	if (curLevel[11].length > 0) {
		backgroundImg.src = curLevel[11][0];
	}
	if (curLevel[11].length > 1) {
		foregroundImg.src = curLevel[11][1];
	}
	if (curLevel[16] != '') {
		myAudio.pause();
		myAudio = new Audio('music/' + curLevel[16]);
		myAudio.volume = 0.1;
		myAudio.addEventListener(
			'ended',
			function () {
				this.currentTime = 0;
				this.play();
			},
			false,
		);
		if (allowMusic) {
			myAudio.play();
		}
	}
}

function drawScene() {
	//context.fillStyle = "rgb(0,0,0)";
	//context.fillRect(container.start.x, container.start.y, container.width, container.height);

	if (curLevel[11].length > 0) {
		context.drawImage(
			backgroundImg,
			container.start.x,
			container.start.y,
			container.width,
			container.height,
		);
	} else {
		context.fillStyle = 'rgb(0,0,0)';
		context.fillRect(container.start.x, container.start.y, container.width, container.height);
	}

	context.strokeStyle = 'rgb(255,255,255)';
	context.strokeRect(container.start.x, container.start.y, container.width, container.height);

	//curtain pole
	//context.beginPath();
	//context.arc(fabInfo.start.x-8,fabInfo.start.y,5,0,2*Math.PI);
	//context.arc(fabInfo.stop.x,fabInfo.start.y,5,-Math.PI,Math.PI);
	//context.stroke();

	//window
	//context.strokeRect(fabInfo.start.x-4, fabInfo.start.y, fabInfo.width*fabInfo.space, fabInfo.height*fabInfo.space);
}
