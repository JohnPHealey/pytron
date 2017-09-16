var boardWidth=510;
var boardHeight = 510;
var headLength = 15;
var gameSpeed=130;
var gameMode;
var speedMap = {"Slow":200, "Normal": 130, "Fast":100};
var speedName;
var winner;

var food;
var gameStarted = false;

var players = []

var player1;
var player2;

var scoreBoard1;
var scoreBoard2;

var myGameArea = {
    canvas : document.createElement("canvas"),
    display : function() {
		this.canvas.width = boardWidth;
        this.canvas.height = boardHeight;
        this.context = this.canvas.getContext("2d");
        this.canvas.style.border='1px solid black';
        document.body.insertBefore(this.canvas, document.body.childNodes[0]);
        generateFood(true);
        var head1 = new Component(headLength, headLength, "red", headLength, headLength);
        var body1 = [];
        body1[0] = head1;
        player1 = new Player(head1, body1, 0);
        players[0] = player1;
        var head2 = new Component(headLength, headLength, "blue", boardWidth-headLength*2, boardHeight-headLength*2);
        var body2 = [];
        body2[0] = head2;
        player2 = new Player(head2, body2, 0);
        players[1] = player2;
    },
    start : function() {
        this.interval = setInterval(updateGameArea, gameSpeed);
    },
    clear : function() {
        this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
    },
    stop : function() {
        clearInterval(this.interval);
    }
}

function setMode(mode) {
	gameMode = mode;
}

function displayGame(speed) {
	speedName = speed;
	gameSpeed = speedMap[speed];
	myGameArea.display();
}


function startGame() {
	gameStarted = true;
	scoreBoard1 = new Component("20px", "Consolas", "black", 10, 40, "text");
	scoreBoard2 = new Component("20px", "Consolas", "black", boardWidth-110, 40, "text");
    myGameArea.start();
}

function Component(width, height, color, x, y, type) {
    this.width = width;
    this.height = height;
    this.type = type;
    this.dir; //-2 is up, -1 is left, 1 is right, 2 is down
    this.dirChanged = false;
    this.x = x;
    this.y = y;
    this.speedX=0;
    this.speedY=0;
    ctx = myGameArea.context;
    ctx.fillStyle = 'white';
    ctx.fillRect(this.x, this.y, this.width, this.height);
    ctx.fillStyle = color;
    ctx.fillRect(this.x+1, this.y+1, this.width-1, this.height-1);
    this.update = function() {
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
        this.x += this.speedX * this.dir;
    }
    this.newYPos = function() {
        this.y += this.speedY * this.dir/2;
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

function Player(head, body, score) {
	this.head = head;
	this.body = body;
	this.score = score;
}

function updateGameArea() {
    myGameArea.clear();
    for (var j = 0; j < players.length; j++) {
    	var curbody = players[j].body;
    	var curhead = players[j].head;
    	if (curbody[1]) {
			for (var i = curbody.length-1; i > 0; i--) {
    	   		curbody[i].x = curbody[i-1].x;
    	   		curbody[i].y = curbody[i-1].y;
    	   		curbody[i].update();
    	   	}
    	}
    	if (Math.abs(curhead.dir)==1) {
    		curhead.newXPos();
    	}
    	else if (Math.abs(curhead.dir)==2) {
    		curhead.newYPos();
    	}
    	if (curhead.crashWith(food)) {
    		eatFood(j);
    	}
    	else {
    		food.update();
    	}
    	if (bodyCrash(curhead) && curbody.length > 2) {
    		endGame(j+1);
    	}
    	else if (wallCrash()) {
    		endGame(wallCrash());
    	}
   		curhead.update();
    	curhead.dirChanged = false;
	
	    scoreBoard1.text="Player 1: " + player1.score;
		scoreBoard1.update();
	    scoreBoard2.text="Player 2: " + player2.score;
		scoreBoard2.update();
	}
}

function bodyCrash(piece) {
	for (var j = 0; j < players.length; j++) {
		for (var i = 1; i < players[j].body.length; i++) {
			if (piece.crashWith(players[j].body[i])) {
				return true;
			}
		}
	}
	return false;
}

function wallCrash() {
	if (player1.head.x < 0 || player1.head.x > boardWidth-headLength ||
		player1.head.y < 0 || player1.head.y > boardWidth-headLength) {
			return 1;
			winner = 2;
			console.log("crash1");
	}
	if (player2.head.x < 0 || player2.head.x > boardWidth-headLength ||
		player2.head.y < 0 || player2.head.y > boardWidth-headLength) {
			return 2;
			winner = 1;
			console.log("crash2");
	}
	return 0;
}

function dirChange(evt) {
	var newDir = evt.key;
	if (!gameStarted && (newDir=="s" || newDir=="d" || newDir=="a" || newDir=="w")) {
		player2.head.dir=-2;
		player2.head.speedY=headLength;
		dir1Change(evt);
		startGame();
	}
	else if (!gameStarted && (newDir=="ArrowDown" || newDir=="ArrowRight" || newDir=="ArrowLeft" || newDir=="ArrowUp")) {
		player1.head.dir=2;
		player1.head.speedY=headLength;
		dir2Change(evt);
		startGame();
	}
	dir1Change(evt);
	dir2Change(evt);
}

var lastPushed1 = null;
function dir1Change(evt) {
	if (lastPushed1 && evt.key == lastPushed1.key) return;
	lastPushed1 = evt;
	var newDir = evt.key;
	if (player1.head.dirChanged) {
		updateGameArea();
	}
	if (newDir=="s" && (player1.head.dir != -2 || player1.body.length == 1)) {
		player1.head.speedX=0;
		player1.head.speedY=headLength;
		player1.head.dir=2;
	}
	else if (newDir=="d" && (player1.head.dir != -1 || player1.body.length == 1)) {
		player1.head.speedX=headLength;
		player1.head.speedY=0;
		player1.head.dir=1;
	}
	else if (newDir=="a" && (player1.head.dir != 1 || player1.body.length == 1)) {
		player1.head.speedX=headLength;
		player1.head.speedY=0;
		player1.head.dir=-1;
	}
	else if (newDir=="w" && (player1.head.dir != 2 || player1.body.length == 1)) {
		player1.head.speedX=0;
		player1.head.speedY=headLength;
		player1.head.dir=-2;
	}
	player1.head.dirChanged = true;
}

var lastPushed2 = null;
function dir2Change(evt) {
	if (lastPushed2 && evt.key == lastPushed2.key) return;
	lastPushed2 = evt;
	var newDir = evt.key;
	if (player2.head.dirChanged) {
		updateGameArea();
	}
	if (newDir=="ArrowDown" && (player2.head.dir != -2 || player2.body.length == 1)) {
		player2.head.speedX=0;
		player2.head.speedY=headLength;
		player2.head.dir=2;
	}
	else if (newDir=="ArrowRight" && (player2.head.dir != -1 || player2.body.length == 1)) {
		player2.head.speedX=headLength;
		player2.head.speedY=0;
		player2.head.dir=1;
	}
	else if (newDir=="ArrowLeft" && (player2.head.dir != 1 || player2.body.length == 1)) {
		player2.head.speedX=headLength;
		player2.head.speedY=0;
		player2.head.dir=-1;
	}
	else if (newDir=="ArrowUp" && (player2.head.dir != 2 || player2.body.length == 1)) {
		player2.head.speedX=0;
		player2.head.speedY=headLength;
		player2.head.dir=-2;
	}
	player2.head.dirChanged = true;
}

function generateFood(checkFirst) {
	var x = Math.ceil((Math.random() * (boardWidth-headLength))/15)*15;
	var y = Math.ceil((Math.random() * (boardHeight-headLength))/15)*15;
	if (checkFirst || bodyCrash(new Component(headLength, headLength, "#00ffffff", x, y))) {
		while (x == headLength && y == headLength || bodyCrash(new Component(headLength, headLength, "white", x, y))) {
			var x = Math.ceil((Math.random() * (boardWidth-headLength))/15)*15;
			var y = Math.ceil((Math.random() * (boardHeight-headLength))/15)*15;
		}
	}
    food = new Component(headLength, headLength, "gold", x, y);
}

function eatFood(player) {
	var newX = boardWidth + 15;
	var newY = boardHeight + 15;
	if (player == 0) {
		player1.body.push(new Component(headLength, headLength, "black", newX,
																   newY));
		player1.score++;
	}
	else if (player == 1) {
		player2.body.push(new Component(headLength, headLength, "black", newX,
																   newY));
		player2.score++;
	}
	generateFood(false);
}

function endGame(loser) {
	myGameArea.stop();
	console.log(loser);
	gameModes = {"Co-Op":1, "Vs.":2};
	if (!loser) {
		console.log("hey");
		if (player1.score > player2.score) {
			winner=1;
		}
		else if (player2.score > player1.score) {
			winner=2;
		}
		else winner=0;
	}
	else if (loser == 1) {
		console.log("2 wins");
		winner = 2;
	}
	else if (loser == 2) {
		console.log("1 wins");
		winner = 1;
	}
	var score = player1.score + player2.score;
	window.location.replace("http://www.cs.mun.ca/~jph432/project/php/gameOver.php?score=" + score +
							"&players=2&mode=" + gameModes[gameMode] + "&speed='" + speedName + "'&winner=" + winner);
}
