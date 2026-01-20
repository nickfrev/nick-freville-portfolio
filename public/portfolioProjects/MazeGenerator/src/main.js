window.onload = function () {
	// settings
	var canvas;
	var ctx;

	var tileWidth;
	var tileHeight;

	var worldWidth;
	var worldHeight;

	var worldMap = [[]];
	var circleRadius;

	init();

	function init() {
		console.log('Initializing...');
		canvas = document.getElementById('c');
		ctx = canvas.getContext('2d');

		canvas.width = window.innerWidth;
		canvas.height = window.innerHeight;

		ctx.fillStyle = 'rgb(0,0,0)';
		ctx.fillRect(0, 0, canvas.width, canvas.height);

		worldWidth = 50;

		tileWidth = canvas.width / worldWidth;
		tileHeight = tileWidth;
		circleRadius = tileWidth / 4;

		worldHeight = Math.floor(canvas.height / tileWidth);

		createWorld();
	}

	function distTo(start, stop) {
		x = start.x - stop.x;
		y = start.y - stop.y;
		return Math.sqrt(x * x + y * y);
	}

	function Astar(start, stop) {
		maze = [];
		nodes = [];
		path = [];
		var cur;
		var curLow, low, x, y;
		//make a clone of the maze
		//ctx.font="15px Arial";
		for (var x = 0; x < worldWidth; x++) {
			maze[x] = [];
			for (var y = 0; y < worldHeight; y++) {
				cur = { x: x, y: y };
				maze[x][y] = {
					cur: { x: x, y: y },
					wall: worldMap[x][y],
					parent: { x: -1, y: -1 },
					weight: distTo(cur, start) + distTo(cur, stop) * 2,
				};
				//ctx.strokeText(Math.round(maze[x][y].weight),cur.x * tileWidth+5,cur.y * tileHeight+15);
			}
		}

		var centerOffset = tileWidth / 2;
		//debug
		ctx.strokeStyle = 'rgb(255,0,0)';
		ctx.beginPath();
		ctx.arc(
			start.x * tileWidth + centerOffset,
			start.y * tileHeight + centerOffset,
			circleRadius,
			0,
			2 * Math.PI,
		);
		ctx.stroke();

		ctx.strokeStyle = 'rgb(0,255,0)';
		ctx.beginPath();
		ctx.arc(
			stop.x * tileWidth + centerOffset,
			stop.y * tileHeight + centerOffset,
			circleRadius,
			0,
			2 * Math.PI,
		);
		ctx.stroke();
		ctx.strokeStyle = 'rgb(0,255,255)';

		nodes[0] = maze[start.x][start.y];
		nodes[0].wall = 1;
		while (nodes.length > 0) {
			//find the lowest node
			curLow = nodes[0];
			low = 0;
			for (i = 1; i < nodes.length; i++) {
				if (nodes[i].weight < curLow.weight) {
					curLow = nodes[i];
					low = i;
				}
			}
			//alert(nodes.length);
			nodes.splice(low, 1); //remove it from the nodes
			//from the current low add the surrounding ones
			x = curLow.cur.x;
			y = curLow.cur.y;
			if (stop.x == curLow.cur.x && stop.y == curLow.cur.y) {
				break;
			}
			//alert(nodes.length);
			ctx.beginPath();
			ctx.arc(
				x * tileWidth + centerOffset,
				y * tileHeight + centerOffset,
				circleRadius,
				0,
				2 * Math.PI,
			);
			ctx.stroke();
			//up
			if (y + 1 < worldHeight) {
				if (maze[x][y + 1].wall == 0) {
					maze[x][y + 1].wall = 1;
					maze[x][y + 1].parent = curLow.cur;
					nodes.push(maze[x][y + 1]);

					ctx.beginPath();
					ctx.moveTo(
						maze[x][y + 1].cur.x * tileWidth + centerOffset,
						maze[x][y + 1].cur.y * tileHeight + centerOffset,
					);
					ctx.lineTo(x * tileWidth + centerOffset, y * tileHeight + centerOffset);
					ctx.stroke();
				}
			}
			//down
			if (y - 1 >= 0) {
				if (maze[x][y - 1].wall == 0) {
					maze[x][y - 1].wall = 1;
					maze[x][y - 1].parent = curLow.cur;
					nodes.push(maze[x][y - 1]);

					ctx.beginPath();
					ctx.moveTo(
						maze[x][y - 1].cur.x * tileWidth + centerOffset,
						maze[x][y - 1].cur.y * tileHeight + centerOffset,
					);
					ctx.lineTo(x * tileWidth + centerOffset, y * tileHeight + centerOffset);
					ctx.stroke();
				}
			}
			//left
			if (x - 1 >= 0) {
				if (maze[x - 1][y].wall == 0) {
					maze[x - 1][y].wall = 1;
					maze[x - 1][y].parent = curLow.cur;
					nodes.push(maze[x - 1][y]);

					ctx.beginPath();
					ctx.moveTo(
						maze[x - 1][y].cur.x * tileWidth + centerOffset,
						maze[x - 1][y].cur.y * tileHeight + centerOffset,
					);
					ctx.lineTo(x * tileWidth + centerOffset, y * tileHeight + centerOffset);
					ctx.stroke();
				}
			}
			//right
			if (x + 1 < worldWidth) {
				if (maze[x + 1][y].wall == 0) {
					maze[x + 1][y].wall = 1;
					maze[x + 1][y].parent = curLow.cur;
					nodes.push(maze[x + 1][y]);

					ctx.beginPath();
					ctx.moveTo(
						maze[x + 1][y].cur.x * tileWidth + centerOffset,
						maze[x + 1][y].cur.y * tileHeight + centerOffset,
					);
					ctx.lineTo(x * tileWidth + centerOffset, y * tileHeight + centerOffset);
					ctx.stroke();
				}
			}
		}
		curScan = stop;
		//alert(maze[curScan.x][curScan.y].parent.x);
		ctx.fillStyle = 'rgb(255,0,255)';
		while (maze[curScan.x][curScan.y].parent.x != -1) {
			ctx.beginPath();
			ctx.arc(
				curScan.x * tileWidth + tileWidth / 2,
				curScan.y * tileHeight + tileHeight / 2,
				circleRadius - 2,
				0,
				2 * Math.PI,
			);
			ctx.fill();
			//alert("hi");
			path.unshift(maze[curScan.x][curScan.y].parent);
			curScan = maze[curScan.x][curScan.y].parent;
		}
	}

	function addMaze() {
		var nodes = [];
		var curNode;
		var tmp, totBor, x, y;
		nodes[0] = { x: 1, y: 1 };
		var hold = [];
		while (nodes.length > 0) {
			//pick a random node and remove it
			tmp = Math.round((nodes.length - 1) * Math.random());
			curNode = nodes[tmp];
			nodes.splice(tmp, 1);
			//check that node to see if it is free
			x = curNode.x;
			y = curNode.y;
			totBor = 0; //empty this
			hold = []; //empty this too
			//up
			if (y + 1 < worldHeight) {
				if (worldMap[x][y + 1] == 1) {
					hold.push({ x: x, y: y + 1 });
					totBor++;
				}
			}
			//down
			if (y - 1 >= 0) {
				if (worldMap[x][y - 1] == 1) {
					hold.push({ x: x, y: y - 1 });
					totBor++;
				}
			}
			//left
			if (x - 1 >= 0) {
				if (worldMap[x - 1][y] == 1) {
					hold.push({ x: x - 1, y: y });
					totBor++;
				}
			}
			//right
			if (x + 1 < worldWidth) {
				if (worldMap[x + 1][y] == 1) {
					hold.push({ x: x + 1, y: y });
					totBor++;
				}
			}
			//alert(hold.length);
			if (totBor >= 3) {
				//it is free
				worldMap[x][y] = 0;
				nodes.push.apply(nodes, hold);
			}
		}
	}

	var goal = { z: 0, y: 0 };
	function createWorld() {
		console.log('Creating world...');

		// lets create wall tiles
		for (var x = 0; x < worldWidth; x++) {
			worldMap[x] = [];
			for (var y = 0; y < worldHeight; y++) {
				worldMap[x][y] = 1;
			}
		}

		/*// lets throw some stones around ;)
    for(var x=0; x < worldWidth; x++){
      for(var y=0; y < worldHeight; y++){
        if(Math.random() > 0.9){
          worldMap[x][y] = 1;
        }
      }
    }*/
		addMaze();

		/*// draw walls
    for(var x=0; x < worldWidth; x++){
      for(var y=0; y < worldHeight; y++){
        if(x == 0 || y == 0 || x == worldWidth-1 || y == worldHeight-1){
          worldMap[x][y] = 1;
        }
      }
    }*/

		//find a goal near the far right bottom
		goal = { x: worldWidth - 2, y: worldHeight - 2 };
		for (var i = 0; i < worldWidth; i++) {
			if (worldMap[worldWidth - (2 + i)][worldHeight - 2] == 0) {
				goal = { x: worldWidth - (2 + i), y: worldHeight - 2 };
				break;
			}
		}

		drawWorld();
		Astar({ x: 1, y: 1 }, goal); //{x:worldWidth-2,y:worldHeight-2})
	}

	function drawWorld() {
		console.log('Drawing world...');
		for (var x = 0; x < worldMap.length; x++) {
			for (var y = 0; y < worldMap[x].length; y++) {
				// draw our tiles color
				if (worldMap[x][y] == 1) {
					ctx.strokeStyle = 'rgb(50,255,200)';
					ctx.fillStyle = 'rgb(20,20,20)';
					ctx.fillRect(x * tileWidth, y * tileHeight, tileWidth, tileHeight);
				} else {
					ctx.strokeStyle = 'rgba(0,0,0,0)';
				}
				if (x == 1 && y == 1) {
					ctx.strokeStyle = 'rgb(255,0,0)';
				}

				if (x == goal.x && y == goal.y) {
					ctx.strokeStyle = 'rgb(255,0,0)';
				}
				ctx.strokeRect(x * tileWidth, y * tileHeight, tileWidth, tileHeight);
			}
		}
	}
};
