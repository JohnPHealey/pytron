<!DOCTYPE html>
<html>

	<head>
		<link rel="stylesheet" type="text/css" href="style.css">
		<link rel="icon" href="../images/snakeIcon3.jpg">
		<script type="text/javascript" src="../js/gameOver.js"></script>
	</head>
		
	<body>

		<table align="center">
    		<tr>
    			<th>Game Over</th>
			</tr>
			
			<tr>
				<?php
					if ($_GET['mode'] == 1) {
						echo '<td align="center" id="yourscore">Your Score:</td>';
					}
					else {
						echo '<td align="center" id="winnerhead">Winner:</td>';
					}
				?>
			</tr>
			
			<tr>
				<td>
					<?php
						$winner = "";
						if ($_GET['mode'] == 1) {	//show score
							echo '<p align="center" id="finalscore">'.$_GET['score'].'</p>';
						}
						else {	//show winner
							if ($_GET['winner'] == 1) {
								$winner = "Player 1";
							}
							else if ($_GET['winner'] == 2) {
								$winner = "Player 2";
							}
							else {
								$winner = "Draw";
							}
							echo '<p align="center" id="winner">'.$winner.'</p>';
						}
					?>
				</td>
			</tr>
						
			<tr>
				<?php
					if ($_GET['mode'] == 3) { //play again with same difficulty
						echo '<td align="center"><button type="button" id="playagain" class="gameoverButtons" 
							  onclick="playAgain(3, '.$_GET['mode'].', '.$_GET['diff'].');">Play Again</button></td>';
					}
					else {	//play again with same speed and number of players
						echo '<td align="center"><button type="button" id="playagain" class="gameoverButtons" 
							  onclick="playAgain('.$_GET['players'].', '.$_GET['mode'].', '.$_GET['speed'].');">Play Again</button></td>';
					}
				?>
			</tr>
			
			<tr>
				<td align="center"><button type="button" onclick="mainMenu()" id="mainmenu" class="gameoverButtons">Main Menu</button></td>
			</tr>
				
			<tr>
				<?php
					if ($_GET['mode'] == 1) { //allow submission to leaderboards
						echo '<td align="center"><button type="button" onclick="showUserName()"'.
						'id="showuser" class="gameoverButtons">Submit to Leaderboards</button></td>';
					}
				?>
			</tr>
		</table>
		<div id="usernameDiv" style="display: none">
			<form method="POST" action="submitScore.php">
				<table align="center">
					<tr>
						<td align="center"><input type="text" id="username" name="username" maxlength="5" placeholder="Your Initials..."></input></td>
					</tr>
					<tr>
						<td align="center"><input type="submit" value="Submit"></input>
							<button type="button" onclick="hideUserName()" id="hideuser">Cancel</button></td>
					</tr>
				</table>
				<?php
					//submit hidden values to database
					echo '<input type="hidden" name="score" value='.$_GET['score'].'>'.
						 '<input type="hidden" name="game" value='.$_GET['players'].'>'.
						 '<input type="hidden" name="speed" value='.$_GET['speed'].'>';
				?>
			</form>
		</div>
		
	</body>
</html>
