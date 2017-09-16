var colorMap = ["#f47a7ab", "#ff5e5e", "#ff0000"];

var speedMap = {"Slow":0, "Normal":1, "Fast":2};
var speeds = ["Slow", "Normal", "Fast"];
function changeSpeed(mode, action) {
	var speedText = document.getElementById("speed" + mode);
	var curSpeed = speedText.value;
	var newSpeed = (speedMap[curSpeed] + action) % 3;
	if (newSpeed < 0) {
		newSpeed = 2;
	}
	speedText.value = speeds[newSpeed];
}

var diffMap = {"Easy":0, "Normal":1, "Hard":2};
var diffs = ["Easy", "Normal", "Hard"];
function changeDifficulty(action) {
	var diffText = document.getElementById("difficulty");
	var curDiff = diffText.value;
	var newDiff = (diffMap[curDiff] + action) % 3;
	if (newDiff < 0) {
		newDiff = 2;
	}
	diffText.value = diffs[newDiff];
}

var modeMap = {"Vs.":0, "Co-Op":1};
var modes = ["Vs.", "Co-Op"];
function changeMode(action) {
	var modeText = document.getElementById("mode");
	var curMode = modeText.value;
	var newMode = (modeMap[curMode] + action) % 2;
	if (newMode < 0) {
		newMode = 1;
	}
	modeText.value = modes[newMode];
}

var leaderboardMap = {"1 Player":0, "2 Player":1};
var leaderboards = ["1 Player", "2 Player"];
function changeLeaderboardMode(action) {
	var leaderText = document.getElementById("leaderboardMode");
	var curLeader = leaderText.value;
	var newLeader = (leaderboardMap[curLeader] + action) % 2;
	if (newLeader < 0) {
		newLeader = 1;
	}
	leaderText.value = leaderboards[newLeader];
}

function changeLeaderboardSpeed(action) {
	var speedText = document.getElementById("leaderboardSpeed");
	var curSpeed = speedText.value;
	var newSpeed = (speedMap[curSpeed] + action) % 3;
	if (newSpeed < 0) {
		newSpeed = 2;
	}
	speedText.value = speeds[newSpeed];
}

function Score(user, score) {
	this.user = user;
	this.score = score;
	this.toString = function() {
		return this.user + "--" + this.score;
	};
}

function ascending(a,b) {
	if (parseInt(a.score) < parseInt(b.score))
  		return -1;
	if (parseInt(a.score) > parseInt(b.score))
  		return 1;
	return 0;
}
function descending(a,b) {
	if (parseInt(a.score) < parseInt(b.score)) {
  		return 1;
  	}
	if (parseInt(a.score) > parseInt(b.score)) {
  		return -1;
  	}
	return 0;
}
var scores = [];

//make a constant table showing 10 entries, give ability to go through pages
function getLeaderboards(start) {
	var mode = document.getElementById("leaderboardMode");
	var speed = document.getElementById("leaderboardSpeed");
	var url = "viewLeaderboards.php?mode='"+mode.value+"'&speed='"+speed.value+"';";
    var xhr = new XMLHttpRequest();
    xhr.open('GET', url, true );
    xhr.onreadystatechange = function() {
        if ( xhr.readyState != 4) return;
        if ( xhr.status == 200 || xhr.status == 400) {
        	var pairs = xhr.responseText.split(", ");
        	pairs = pairs.slice(0,pairs.length-1);
        	scores = [];
			for (var i = 0; i < pairs.length; i++) {
				var pair = pairs[i].split(":");
				scores.push(new Score(pair[0], pair[1]));
			}
			scores = scores.sort(descending);
			document.getElementById("leaderboardTable").style.display="block";
			document.getElementById("viewbutton").innerHTML = "Update";
			updateLeaderboards(0);
        }
        else {
            console.log("Unknown ERROR");
        }
    };
    xhr.send( null );
}

var start = -9;
function updateLeaderboards(action) {
	if (action == 0) {
		start = 1;
	}
	else {
		start = start + 10*action;
	}
	if (start <= 1) {
		start = 1;
		document.getElementById("leadDec").disabled=true;
		document.getElementById("userHolder").style.backgroundColor="#f7d411";
		document.getElementById("scoreHolder").style.backgroundColor="#f7d411";
	}
	else {
		document.getElementById("leadDec").disabled=false;
		if (start == 11) {
			document.getElementById("userHolder").style.backgroundColor="#dbd8c7";
			document.getElementById("scoreHolder").style.backgroundColor="#dbd8c7";
		}
		else if (start == 21) {
			document.getElementById("userHolder").style.backgroundColor="#bf7433";
			document.getElementById("scoreHolder").style.backgroundColor="#bf7433";
		}
		else {
			document.getElementById("userHolder").style.backgroundColor="#bcb0af";
			document.getElementById("scoreHolder").style.backgroundColor="#bcb0af";
		}
	}
	var userHolder = document.getElementById("userHolder");
	userHolder.innerHTML = "";
	userHolder.start = start;
	for (var j = start; j < start+10; j++) {
		var item = document.createElement("li");
		var entry;
		if (scores[j-1]) {
			entry = scores[j-1].user;
		}
		else {
			entry = "Unclaimed";
		}
		var node = document.createTextNode(entry);
		item.appendChild(node);
		userHolder.append(item);
	}
	var scoreHolder = document.getElementById("scoreHolder");
	scoreHolder.innerHTML = "";
	scoreHolder.start = start;
	for (var j = start; j < start+10; j++) {
		var item = document.createElement("li");
		var entry;
		if (scores[j-1]) {
			entry = scores[j-1].score;
		}
		else {
			entry = "--";
		}
		var node = document.createTextNode(entry);
		item.appendChild(node);
		scoreHolder.append(item);
	}
}

function searchLeaderboard() {
	var userText = document.getElementById("usersearch");
	var scoreText = document.getElementById("scoresearch");
	var startPos = 1;
	if (userText.value != "") {
		if (scoreText.value != "") {
			for (var i = 0; i < scores.length; i++) {
				if (scores[i].user.toLowerCase() == userText.value.toLowerCase() && scores[i].score == parseInt(scoreText.value)) {
					startPos=i;
					break;
				}
			}
		}
		else {
			for (var i = 0; i < scores.length; i++) {
				if (scores[i].user.toLowerCase() == userText.value.toLowerCase()) {
					startPos=i;
					break;
				}
			}			
		}
	}
	else if (scoreText.value != "") {
		for (var i = 0; i < scores.length; i++) {
			if (scores[i].score == parseInt(scoreText.value)) {
				startPos=i;
				break;
			}
		}
	}
	startPos += 1;
	console.log(startPos);
	if (start < startPos) {
		while (start < startPos-9) {
			console.log("start: " + start + " -- increment");
			console.log("startPos: " + startPos);
			updateLeaderboards(1);
		}
	}
	else if (start > startPos) {
		while (start > startPos) {
			console.log("start: " + start + " -- decrement");
			console.log("startPos: " + startPos);
			updateLeaderboards(-1);
		}
	}
}
