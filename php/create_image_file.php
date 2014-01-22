<?php

if(isset($_POST['image']) && !empty($_POST['image'])){

	$dataURL = $_POST['image'];

	$parts = explode(",", $dataURL);
	$dataB64 = $parts[1];

	$data = base64_decode($dataB64);
	$filename = 'temp_image'.uniqid().'.jpg';

	$success = file_put_contents($filename, $data);

	echo $filename;
	
}

?>