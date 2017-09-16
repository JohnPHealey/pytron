var playerMap = ["onePlayer", "twoPlayer", "cpPlayer"];
var modeMap = ["Co-Op", "Vs."];
function playAgain(players, mode, diff) {
	if (players == 1 || players == 2) {
		window.location.replace("http://www.cs.mun.ca/~jph432/project/php/" + playerMap[players-1] + ".php?speed"+players+"="+diff + "&mode="+modeMap[mode-1]);
	}
	else {
		window.location.replace("http://www.cs.mun.ca/~jph432/project/php/" + playerMap[players-1] + diff + ".php");
	}
}

function mainMenu() {
	window.location.replace("http://www.cs.mun.ca/~jph432/project/php/main.php");
}

//do a pop-up pls
function showUserName() {
	var div = document.getElementById("usernameDiv");
	div.style.display="block";
	document.getElementById("username").focus();
	document.getElementById("username").select();
}

//do a pop-up pls
function hideUserName() {
	var div = document.getElementById("usernameDiv");
	div.style.display="none";
}
