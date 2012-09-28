<?php

require_once(dirname(__FILE__) . "/../services/AuthenticationService.php");
require_once(dirname(__FILE__) . "/../utils/ControllerUtils.php");

function handleRequest() {
   if (!isset($_GET['reqType'])) {
        $retValue = ControllerUtils::getErrorResponse(ErrorCodes::INVALID_ARGS, "Mandatory parameter reqType missing");
    } else {
        $retValue = handleRequestInternal();
    }
    $retValueInJson = json_encode($retValue);
    Logger::debug("taskService", "return value $retValueInJson");
    echo $retValueInJson;
}


function handleRequestInternal() {
    try {
        $reqType = $_GET['reqType'];
        if ($reqType == 'logout') {
            $retValue = handleLogout();
            return $retValue;
        } else {
            $retValue = ControllerUtils::getErrorResponse(ErrorCodes::INVALID_REQUEST, "Request $reqType is not supported");
            return $retValue;
        }
    } catch (Exception $ex) {
        $retValue = ControllerUtils::getErrorResponse(ErrorCodes::INTERNAL_ERROR, $ex->getMessage());
        return $retValue;
    }

}

function handleLogout() {
    AuthenticationService::logout();
    return ControllerUtils::getSuccessResponse(TRUE);
}

handleRequest();


?>
