<?php

require_once (dirname(__FILE__) . "/../services/auth/AuthenticationService.php");
require_once (dirname(__FILE__) . "/../utils/ErrorCodes.php");

function getLoggedInUserDetails() {
    $user = AuthenticationService::getLoggedInUser();
    $retValue = array();
    if (isset($retValue)) {
        $retValue['success'] = TRUE;
        $retValue['payload'] = $user;
    } else {
        $retValue['success'] = FALSE;
        $retValue['errCode'] = ErrorCodes::USER_NOT_AUTHENTICATED;
        $retValue['errMsg'] =  ErrorCodes::USER_NOT_AUTHENTICATED_MSG;
    }
    $retValueInJson = json_encode($retValue);
    echo $retValueInJson;
}

getLoggedInUserDetails();

?>
