<?php


require_once (dirname(__FILE__) . "/EmailProcessor.php");
require_once (dirname(__FILE__) . "/EmailMsgGenerator.php");
require_once (dirname(__FILE__) . "/MandrillEmailSender.php");
require_once (dirname(__FILE__) . "/EmailSendPolicy.php");

function startEmailProcessor($agentName) {
    $emailSender = new MandrillEmailSender();
    $emailMsgGenerator = new EmailMsgGenerator();
    $emailSendPolicy = new EmailSendPolicy();
    $emailProcessor = new EmailProcessor($agentName, $emailSender, $emailMsgGenerator, $emailSendPolicy);
    $emailProcessor->run();
}

if ( count($argv) >= 2 ) {
    $agentName = $argv[1];
    startEmailProcessor($agentName);
} else {
    print "Usage: " . $argv[0] . " [agentName]\n";
}