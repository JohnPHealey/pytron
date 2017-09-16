<!DOCTYPE html>

<html>

<head>
	<script type="text/javascript" src="../js/onePlayer.js"></script>
	<link rel="stylesheet" type="text/css" href="style.css">
</head>

<body onkeydown="dirChange(event)">

	<?php	 //set speed
		echo '<script type="text/javascript">document.body.addEventListener(onload, displayGame("'.$_GET["speed1"].'"));</script>';
    ?>
	</div>
</body>

</html>

