<!DOCTYPE html>

<html>

<head>
	<link rel="icon" href="../images/snakeIcon3.jpg">
	<link rel="stylesheet" type="text/css" href="style.css">
	<script type="text/javascript" src="../js/mainMenu.js"></script>
</head>

<body>
	<link rel="icon" href="../images/snakeIcon3.jpg">

	<table id="settingstable" align="center" border>
		<tr>
			<th style="font-size: 25px"><em style="color: red">Py</em><em style="color: blue">Tron</em></th>
		</tr>
		<tr>
			<form method="GET" action="onePlayer.php">
				<td>
					<button type="button" class="accordion">Single Player</button>
					<div class="panel">
  						<table id="oneplayer">
							<tr>
								<td>Speed:</td>
								<td><button type="button" id="speed1Decrement" onclick="changeSpeed(1, -1)">&larr;</td>
								<td id="speedtext" align="center"><input type="text" id="speed1" name="speed1" size="6" value="Normal" readonly></td>
								<td><button type="button" id="speed1Increment" onclick="changeSpeed(1, 1)">&rarr;</td>
									<td colspan=4 align="right"><input type="submit" value="Play!" align="left"></td>
							</tr>
						</table>
					</div>
				</td>
			</form>
		</tr>
		<tr>
			<form method="GET" action="twoPlayer.php">
				<td>
					<button type="button" class="accordion">Two Player</button>
					<div class="panel">
 							<table id="twoplayer">
							<tr>
								<td>Speed:</td>
								<td><button type="button" id="speed2Decrement" onclick="changeSpeed(2, -1)">&larr;</td>
								<td id="speedtext" align="center"><input type="text" id="speed2" name="speed2" size="6" value="Normal" readonly></td>
								<td><button type="button" id="speed2Increment" onclick="changeSpeed(2, 1)">&rarr;</td>
								
								<td colspan=4 align="right"><input type="submit" value="Play!" align="left" style="visibility: hidden"></td>
							</tr>
							<tr>
								<td>Mode:</td>
								<td><button type="button" id="modeDecrement" onclick="changeMode(-1)">&larr;</td>
								<td id="modetext" align="center"><input type="text" id="mode" name="mode" size="6" value="Vs." readonly></td>
								<td><button type="button" id="modeIncrement" onclick="changeMode(1)">&rarr;</td>
								<td colspan=4 align="right"><input type="submit" value="Play!" align="left"></td>
							</tr>
						</table>
					</div>
				</td>
			</form>
		</tr>
		<tr>
			<form method="GET" action="cpPlayer.php">
				<td>
					<button type="button" class="accordion">Play vs. AI</button>
					<div class="panel">
  						<table id="cpplayer">
							<tr>
								<td>Difficulty:</td>
								<td><button type="button" id="difficultyDecrement" onclick="changeDifficulty(-1)">&larr;</td>
								<td id="speedtext" align="center"><input type="text" id="difficulty" name="difficulty" size="6" value="Normal" readonly></input></td>
								<td><button type="button" id="difficultyIncrement" onclick="changeDifficulty(1)">&rarr;</td>
								<td colspan=4 align="right"><input type="submit" value="Play!" align="left"></td>
							</tr>
						</table>
					</div>
				</td>
			</form>
		</tr>
		<tr>
			<td>
				<button type="button" class="accordion" id="leaderboardbutton">Leaderboards</button>
					<div class="panel" id="leaderboardpanel">
						<table id="leaderboardOuter">
							<tr>
								<td>Mode:</td>
								<td><button type="button" onclick="changeLeaderboardMode(-1)">&larr;</td>
								<td id="speedtext" align="center"><input type="text" id="leaderboardMode" name="leaderboardMode" size="6" value="1 Player" readonly></input></td>
								<td><button type="button" onclick="changeLeaderboardMode(1)">&rarr;</td>
								<td colspan=4 align="right"><button type="button" id="viewbutton" align="left" onclick="getLeaderboards(1)" style="visibility: hidden">View</button></td>
							</tr>
								
							<tr>
								<td>Speed:</td>
								<td><button type="button" onclick="changeLeaderboardSpeed(-1)">&larr;</td>
								<td id="speedtext" align="center"><input type="text" id="leaderboardSpeed" name="leaderboardSpeed" size="6" value="Normal" readonly></input></td>
								<td><button type="button" onclick="changeLeaderboardSpeed(1)">&rarr;</td>
								
								<td colspan=4 align="right"><button type="button" id="viewbutton" align="left" onclick="getLeaderboards(1)">View</button></td>
							</tr>
							
														
							<table id="leaderboardTable" style="display: none" align="center">
								<tr align="center"><td><h3>User</h3></td><td><h3>Score</h3></td>
								</tr>
								
								<tr align="center"><td><ol id="userHolder" ></ol></td><td><ol id="scoreHolder" ></ol></td></tr>
								
								<tr align="center">
									<td><button type="button" id="leadDec" onclick="updateLeaderboards(-1)">&larr;</button></td>
									<td><button type="button" id="leadInc" onclick="updateLeaderboards(1)">&rarr;</button></td>
								</tr>
								
								<tr><td><h4>Search</h4></td></tr>
								
								<tr><td><label>Username:</label><input type="text" id="usersearch" maxlength="5"></td>
									<td><label>Score:</label><input type="text" id="scoresearch" maxlength="5" onkeypress='return event.charCode >= 48 && event.charCode <= 57'></td>
								</tr>
								
								<tr>
									<td><button type="button" id="searchbutton" onclick="searchLeaderboard()">Search</button>
								</tr>								
							</table>
						</table>
						
						<?php
								if (array_key_exists("score", $_GET)) {	//user just submitted to leaderboard, so show leaderboard
									echo
										'<script type="text/javascript">'.
											'document.getElementById("leaderboardbutton").classList.toggle("active");'.
											'document.getElementById("leaderboardpanel").style.display="block";'.
											'document.getElementById("usersearch").value = "'.$_GET["user"].'";'.
											'document.getElementById("scoresearch").value = '.$_GET["score"].';'.
											'document.getElementById("leaderboardSpeed").value = "'.$_GET["speed"].'";'.
											'document.getElementById("leaderboardMode").value = "'.$_GET["game"].' Player";'.
											'document.getElementById("viewbutton").click();'.
											'document.getElementById("searchbutton").click();'.
										'</script>';
								}
							?>
						
					</div>
				</td>
		</table>
	<script type="text/javascript" src="../js/createMenu.js"></script>

</body>

</html>
