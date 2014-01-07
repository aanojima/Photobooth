<?php

require 'phpmailer/class.phpmailer.php';

if (isset($_POST["image"]) && isset($_POST["address"]) && !empty($_POST["image"]) && !empty($_POST["address"])){

	$dataURL = $_POST["image"];
	$email = $_POST["address"];

	$parts = explode(",", $dataURL);
	$data = $parts[1];

	$data = base64_decode($data);

	$filename = 'TF-Photobooth-'.uniqid().'.jpg';
	$success = file_put_contents($filename, $data);

	//Create a new PHPMailer instance
	$mail = new PHPMailer();

	// Set PHPMailer to use the sendmail transport
	$mail->IsSendmail();

	//Set who the message is to be sent from
	$mail->SetFrom('techfair-notifications@mit.edu', 'Techfair Photobooth');

	//Set who the message is to be sent to
	$mail->AddAddress($email);	

	//Set the subject line
	$mail->Subject = '[Techfair Photobooth]';

	//Read an HTML message body from an external file, convert referenced images to embedded, convert HTML into a basic plain-text alternative body
	$mail->MsgHTML('<h2>Techfair Photobooth</h2><p>Here is your picture</p>', dirname(__FILE__));

	//Replace the plain text body with one created manually
	$mail->AltBody = 'This is the plain text portion of the email.';

	//Attach an image file
	$mail->AddAttachment($filename);

	//Send the message, check for errors
	if(!$mail->Send()) {
		echo "Mailer Error: " . $mail->ErrorInfo;
	}else{
		echo "Message sent!";
	}

	//Delete Image on Server
	unlink($filename);
}

?>