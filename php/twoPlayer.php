<!DOCTYPE html>

<html>

<head>
	<script type="text/javascript" src="../js/twoPlayer.js"></script>
	<link rel="stylesheet" type="text/css" href="style.css">
</head>

<body onkeydown="dirChange(event)">
	<?php	//set speed and mode (co-op or vs)
		echo '<script type="text/javascript">document.body.addEventListener(onload, displayGame("'.$_GET["speed2"].'"));</script>';
		echo '<script type="text/javascript">setMode("'.$_GET["mode"].'");</script>';
	?>
</body>

</html>

