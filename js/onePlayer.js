var boardWidth=510;
var boardHeight = 510;
var headLength = 15;
var gameSpeed=0;
var speedMap = {"Slow":200, "Normal": 120, "Fast":100};
var speedName;

var score = 0;
var scoreBoard;
var food;
var gameStarted = false;
var dirChanged = false;

var myHead;
var myBody=[];
var myDir; //-2 is up, -1 is left, 1 is right, 2 is down

var myGameArea = {
    canvas : document.createElement("canvas"),
    display : function() {
		this.canvas.width = boardWidth;
        this.canvas.height = boardHeight;
        this.context = this.canvas.getContext("2d");
        this.canvas.style.border='1px solid black';
        document.body.insertBefore(this.canvas, document.body.childNodes[0]);
        generateFood(true);
        myHead = new Component(headLength, headLength, "red", headLength, headLength);
        myBody[0] = myHead;
    },
    start : function() {
        this.interval = setInterval(updateGameArea, gameSpeed);
    },
    clear : function() {
        this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
    },
    stop : function() {
        clearInterval(this.interval);
    },
    end : function() {
    	this.canvas.style.display = "none";
    }
}

function displayGame(speed) {
	speedName = speed;
	gameSpeed = speedMap[speed];
	myGameArea.display();
}

function startGame() {
	gameStarted = true;
	scoreBoard = new Component("20px", "Consolas", "black", boardWidth-100-10, 40, "text");
    myGameArea.start();
}

function Component(width, height, color, x, y, type) {
	this.type = type;
    this.width = width;
    this.height = height;
    this.x = x;
    this.y = y;
    this.speedX=0;
    this.speedY=0;
    ctx = myGameArea.context;
    ctx.fillStyle = 'white';
    ctx.fillRect(this.x, this.y, this.width, this.height);
    ctx.fillStyle = color;
    ctx.fillRect(this.x+1, this.y+1, this.width-1, this.height-1);
    this.update = function(){
    	if (this.type == "text") {
      		ctx.font = this.width + " " + this.height;
      		ctx.fillStyle = color;
      		ctx.fillText(this.text, this.x, this.y);
    	}
    	else {
        	ctx = myGameArea.context;
    		ctx.fillStyle = 'white';
    		ctx.fillRect(this.x, this.y, this.width, this.height);
    		ctx.fillStyle = color;
    		ctx.fillRect(this.x+1, this.y+1, this.width-1, this.height-1);
    	}
    }
    this.newXPos = function() {
        this.x += this.speedX * myDir;
    }
    this.newYPos = function() {
        this.y += this.speedY * myDir/2;
    }
    this.crashWith = function(otherobj) {
        var myleft = this.x;
        var myright = this.x + (this.width);
        var mytop = this.y;
        var mybottom = this.y + (this.height);
        var otherleft = otherobj.x;
        var otherright = otherobj.x + (otherobj.width);
        var othertop = otherobj.y;
        var otherbottom = otherobj.y + (otherobj.height);
        var crash = true;
        if ((mybottom <= othertop) ||
               (mytop >= otherbottom) ||
               (myright <= otherleft) ||
               (myleft >= otherright)) {
           crash = false;
        }
        return crash;
    }
}

function updateGameArea() {
    myGameArea.clear();
    if (myBody[1]) {
		for (var i = myBody.length-1; i > 0; i--) {
    	   	myBody[i].x = myBody[i-1].x;
    	   	myBody[i].y = myBody[i-1].y;
    	   	myBody[i].update();
    	}
    }
    if (Math.abs(myDir)==1) {
    	myHead.newXPos();
    }
    else if (Math.abs(myDir)==2) {
    	myHead.newYPos();
    }
    if (myHead.crashWith(food)) {
    	eatFood();
    }
    else {
    	food.update();
    }
    if (bodyCrash(myHead) || wallCrash()) {
    	endGame();
    }
    myHead.update();
    dirChanged = false;
    scoreBoard.text="SCORE: " + score;
	scoreBoard.update();
}

function bodyCrash(piece) {
	for (var i = 1; i < myBody.length; i++) {
		if (piece.crashWith(myBody[i])) {
			return true;
		}
	}
	return false;
}

function wallCrash() {
	if (myHead.x < 0 || myHead.x > boardWidth-headLength ||
		myHead.y < 0 || myHead.y > boardWidth-headLength) {
			return true;
	}
	return false;
}

var lastPushed = null;
function dirChange(evt) {
	if (lastPushed && evt.key == lastPushed.key) return;
	lastPushed = evt;
	var newDir = evt.key;
	if (!gameStarted && (newDir=="s" || newDir=="d" || newDir=="a" || newDir=="w" ||
						 newDir=="ArrowDown" || newDir=="ArrowRight" || newDir=="ArrowLeft" || newDir=="ArrowUp")) {
		startGame();
	}
	if (dirChanged) {
		updateGameArea();
	}
	if ((newDir=="s" || newDir=="ArrowDown") && (myDir != -2 || myBody.length == 1)) {
		myHead.speedX=0;
		myHead.speedY=headLength;
		myDir=2;
	}
	else if ((newDir=="d"|| newDir=="ArrowRight") && (myDir != -1 || myBody.length == 1)) {
		myHead.speedX=headLength;
		myHead.speedY=0;
		myDir=1;
	}
	else if ((newDir=="a"|| newDir=="ArrowLeft") && (myDir != 1 || myBody.length == 1)) {
		myHead.speedX=headLength;
		myHead.speedY=0;
		myDir=-1;
	}
	else if ((newDir=="w"|| newDir=="ArrowUp") && (myDir != 2 || myBody.length == 1)) {
		myHead.speedX=0;
		myHead.speedY=headLength;
		myDir=-2;
	}
	dirChanged = true;
}

function generateFood(checkFirst) {
	var x = Math.ceil((Math.random() * (boardWidth-headLength))/15)*15;
	var y = Math.ceil((Math.random() * (boardHeight-headLength))/15)*15;
	if (checkFirst || bodyCrash(new Component(headLength, headLength, "#00ffffff", x, y))) {
		while (x == headLength && y == headLength || bodyCrash(new Component(headLength, headLength, "#00ffffff", x, y))) {
			var x = Math.ceil((Math.random() * (boardWidth-headLength))/15)*15;
			var y = Math.ceil((Math.random() * (boardHeight-headLength))/15)*15;
		}
	}
    food = new Component(headLength, headLength, "gold", x, y);
}

function eatFood() {
	var newX = boardWidth + 15;
	var newY = boardHeight + 15;
	myBody.push(new Component(headLength, headLength, "black", newX,
															   newY));
	score++;
	generateFood(false);
}

function endGame() {
	myGameArea.stop();
	myGameArea.end();
	window.location.replace("http://www.cs.mun.ca/~jph432/project/php/gameOver.php?score=" + score + 
							"&players=1&mode=1&speed='" + speedName + "'");
}
