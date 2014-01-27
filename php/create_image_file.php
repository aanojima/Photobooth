<?php

if(isset($_POST['image']) && !empty($_POST['image'])){

	$dataURL = $_POST["image"];

	$parts = explode(",", $dataURL);
	$data = $parts[1];

	$data = base64_decode($data);

	$filename = 'TF-Photobooth-'.uniqid().'.jpg';
	$success = file_put_contents($filename, $data);

	echo $filename;
	
}

?>