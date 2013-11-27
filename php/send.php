<?php

if(strtolower($_SERVER['REQUEST_METHOD'] != 'post'){
	exit;
}

echo "HEY";

if (isset($_POST["image"]) && !empty($_POST["image"])){

	$dataURL = $_POST["image"];

	$parts = explode(",", $dataURL);
	$data = $parts[1];

	$data = base64_decode($data);

	$file = UPLOAD_DIR.uniqid().'png';

	$success = file_put_contents($file, $data);

	echo $success ? $file : "Unable to save this image. ";
}

?>