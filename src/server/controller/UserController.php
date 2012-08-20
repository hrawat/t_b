<?php

require_once (dirname(__FILE__) . "/../services/AuthenticationService.php");
require_once (dirname(__FILE__) . "/../utils/ErrorCodes.php");
require_once (dirname(__FILE__) . "/../utils/ControllerUtils.php");

function getLoggedInUserDetails() {
    $user = AuthenticationService::getLoggedInUser();
    $retValue = array();
    if (isset($retValue)) {
        $retValue = ControllerUtils::getSuccessResponse($user);
    } else {
        $retValue = ControllerUtils::getErrorResponse(ErrorCodes::USER_NOT_AUTHENTICATED,
                                    ErrorCodes::USER_NOT_AUTHENTICATED_MSG);
    }
    $retValueInJson = json_encode($retValue);
    echo $retValueInJson;
}

getLoggedInUserDetails();

?>
