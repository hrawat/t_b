<?php
require_once("/var/www/myTaskBoard/src/server/services/AuthenticationService.php");
$uid = AuthenticationService::getLoggedInUserId();
echo("uid is $uid");

?>
