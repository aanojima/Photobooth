<?php

if(isset($_POST['filename']) && !empty($_POST['filename'])){
	$filename = $_POST['filename'];
	unlink($filename);
}

?>