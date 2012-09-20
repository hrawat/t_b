<?php

require_once (dirname(__FILE__) . "/../services/AuthenticationService.php");

require_once (dirname(__FILE__) . "/../utils/ControllerUtils.php");
require_once (dirname(__FILE__) . "/../utils/ErrorCodes.php");


function handleRequest() {
    $userId = AuthenticationService::getLoggedInUserId();
    if (!isset($userId)) {
        $retValue = ControllerUtils::getErrorResponse(ErrorCodes::USER_NOT_AUTHENTICATED, ErrorCodes::USER_NOT_AUTHENTICATED_MSG);
    } else if (!isset($_GET['reqType'])) {
        $retValue = ControllerUtils::getErrorResponse(ErrorCodes::INVALID_ARGS, "Mandatory parameter reqType missing");
    } else {
        $retValue = handleRequestInternal($userId);
    }
    $retValueInJson = json_encode($retValue);
    Logger::debug("categoryService", "return value $retValueInJson");
    echo $retValueInJson;
}

function handleRequestInternal($userId) {
    try {
        $reqType = $_GET['reqType'];
        if ($reqType == 'listCategories') {
            $payload = handleListCategories($userId);
            $retValue = ControllerUtils::getSuccessResponse($payload);
            return $retValue;
        } else if ($reqType == 'createCategory') {
            return handleCreateCategory($userId);
        } else {
            $retValue = ControllerUtils::getErrorResponse(ErrorCodes::INVALID_REQUEST, "Request $reqType is not supported");
            return $retValue;
        }
    } catch (Exception $ex) {
        $retValue = ControllerUtils::getErrorResponse(ErrorCodes::INTERNAL_ERROR, $ex->getMessage());
        return $retValue;
    }

}

function handleListCategories($userId) {
    $categories = CategoryService::userCategories($userId);
    return $categories;

}

function handleCreateCategory($userId) {
    $mandatoryArgsRetValue = ControllerUtils::checkMandatoryArgs(array("name"));
    if ($mandatoryArgsRetValue != NULL) {
        return $mandatoryArgsRetValue;
    }

    $name = ControllerUtils::getArgValue("name", "");
    $colorCode = ControllerUtils::getArgValue("colorCode", "ff0000");
    $sharedWithUsers = ControllerUtils::getArgValue("sharedWithUsersEmail", "");

    $categoryId = CategoryService::create($name, $colorCode, $userId);
    $category = CategoryService::lookup($categoryId);

    if (isset($category)) {
        $retValue = ControllerUtils::getSuccessResponse($category);
    } else {
        $retValue = ControllerUtils::getErrorResponse(ErrorCodes::INTERNAL_ERROR, "Internal Error: cannot fetch category from DB");
    }
    return $retValue;



}

handleRequest();
