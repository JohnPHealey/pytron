var boardWidth=510;
var boardHeight = 510;
var headLength = 15;
var gameSpeed=200;

var food;
var gameStarted = false;

var players = []

var player1;
var cp;
var changeCP = true;
var prevDirs = [];

var scoreBoard1;
var scoreBoard2;

/**
* General area where the game takes place
*/
var myGameArea = {
    canvas : document.createElement("canvas"),
    display : function() { //show game board before start of game
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
        cp = new Player(head2, body2, 0);
        players[1] = cp;
    },
    start : function() {	//pieces start moving
        this.interval = setInterval(updateGameArea, gameSpeed);
    },
    clear : function() {	//clear board
        this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
    },
    stop : function() {	//end game
        clearInterval(this.interval);
    }
}

/**
* Display board before start of game
*/
function displayGame() {
	myGameArea.display();
}

function startGame() {
	gameStarted = true;
	scoreBoard1 = new Component("20px", "Consolas", "black", 10, 40, "text");
	scoreBoard2 = new Component("20px", "Consolas", "black", boardWidth-110, 40, "text");
	cp.head.dir = -2;
	cp.head.speedY=headLength;
	cp.head.speedX=0;
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
    this.update = function() {	//move pieces
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
    this.newXPos = function() {	//change x-coordinate based on piece speed
        this.x += this.speedX * this.dir;
    }
    this.newYPos = function() { //change y-coordinate based on piece speed
        this.y += this.speedY * this.dir/2;
    }
    this.crashWith = function(otherobj) {	//check if this piece is crashing with the given piece
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

var skip = false;
function updateGameArea() {
    myGameArea.clear();
    if (!skip) {
    	if (changeCP) {
    		cpChooseDir();
    	}
    	if (prevDirs[0] != cp.head.dir) {
    		var temp = prevDirs[0];
    		prevDirs[0] = cp.head.dir;
    		prevDirs[1] = temp;
    	}
    	changeCP = true;
		if (Math.abs(cp.head.dir) == 1) {
			cp.head.speedX = headLength;
			cp.head.speedY = 0;
		}
		else {
			cp.head.speedX = 0;
			cp.head.speedY = headLength;
		}
	}
	else {
		skip = true;
	}
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
	    scoreBoard2.text="Player 2: " + cp.score;
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
	}
	if (cp.head.x < 0 || cp.head.x > boardWidth-headLength ||
		cp.head.y < 0 || cp.head.y > boardWidth-headLength) {
			return 2;
	}
	return 0;
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
	if (player1.dirChanged) {
		updateGameArea();
	}
	if ((newDir=="s" || newDir=="ArrowDown") && (player1.head.dir != -2 || player1.body.length == 1)) {
		player1.head.speedX=0;
		player1.head.speedY=headLength;
		player1.head.dir=2;
	}
	else if ((newDir=="d"|| newDir=="ArrowRight") && (player1.head.dir != -1 || player1.body.length == 1)) {
		player1.head.speedX=headLength;
		player1.head.speedY=0;
		player1.head.dir=1;
	}
	else if ((newDir=="a"|| newDir=="ArrowLeft") && (player1.head.dir != 1 || player1.body.length == 1)) {
		player1.head.speedX=headLength;
		player1.head.speedY=0;
		player1.head.dir=-1;
	}
	else if ((newDir=="w"|| newDir=="ArrowUp") && (player1.head.dir != 2 || player1.body.length == 1)) {
		player1.head.speedX=0;
		player1.head.speedY=headLength;
		player1.head.dir=-2;
	}
	player1.dirChanged = true;
}

function cpChooseDir() {
	var diff = Math.floor(Math.random() * 2) + 1
	if (diff == 1) {
		goForFood();
	}
	avoidWalls();
	avoidBodies();
}

function goForFood() { //-2 is up, -1 is left, 1 is right, 2 is down
	if (food.x < cp.head.x) {
		cp.head.dir = -1;
	}
	else if (food.x > cp.head.x) {
		cp.head.dir = 1;
	}
	else if (food.y < cp.head.y) {
		cp.head.dir = -2;
	}
	else {
		cp.head.dir = 2;
	}
}

function avoidWalls() {
	if (cp.head.x == boardWidth-headLength) {
		if (cp.head.y == 0) {
			if (cp.head.dir == 1) {
				cp.head.dir = 2;
			}
			else if (cp.head.dir == -2) {
				cp.head.dir = -1;
			}
		}
		else if (cp.head.y == boardHeight-headLength) {
			if (cp.head.dir == 1) {
				cp.head.dir = -2;
			}
			else if (cp.head.dir == 2) {
				cp.head.dir = -1;
			}
		}
	}
	else if (cp.head.x == 0) {
		if (cp.head.y == 0) {
			if (cp.head.dir == -1) {
				cp.head.dir = 2;
			}
			else if (cp.head.dir == -2) {
				cp.head.dir = 1;
			}
		}
		else if (cp.head.y == boardHeight-headLength) {
			if (cp.head.dir == -1) {
				cp.head.dir = -2;
			}
			else if (cp.head.dir == 2) {
				cp.head.dir = 1;
			}
		}
	}
}

function avoidBodies() {
	if (cp.head.dir == -2 && checkBodyCrash(cp.head.x, cp.head.y-headLength)) {
		cp.head.dir = 1;
	}
	
	else if (cp.head.dir == 2 && checkBodyCrash(cp.head.x, cp.head.y+headLength)) {
		cp.head.dir = -1;
	}
	
	else if (cp.head.dir == -1 && checkBodyCrash(cp.head.x-headLength, cp.head.y)) {
		cp.head.dir = 2;
	}
	
	else if (cp.head.dir == 1 && checkBodyCrash(cp.head.x+headLength, cp.head.y)) {
		cp.head.dir = -2;
	}
}

function checkBodyCrash(xPos, yPos) {
	return bodyCrash(new Component(headLength, headLength, "#00ffffff", xPos, yPos));
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
		cp.body.push(new Component(headLength, headLength, "black", newX,
																   newY));
		cp.score++;
		changeCP = false;
	}
	generateFood(false);
}

function endGame(loser) {
	myGameArea.stop();
	if (!loser) {
		console.log("hey");
		if (player1.score > cp.score) {
			winner=1;
		}
		else if (player2.score > cp.score) {
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
	window.location.replace("http://www.cs.mun.ca/~jph432/project/php/gameOver.php?players=2&mode=3&winner=" + winner +
							"&diff='Easy'");
}
