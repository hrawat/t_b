<?php

require_once (dirname(__FILE__) . "/../services/AuthenticationService.php");
require_once (dirname(__FILE__) . "/../services/CategoryService.php");
require_once (dirname(__FILE__) . "/../services/UserService.php");

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
    $categoryColorCodes = array("00FFFF", "0000FF", "0000A0", 
						"ADD8E6", "800080", "FFFF00", "00FF00" , "FF00FF");
    $mandatoryArgsRetValue = ControllerUtils::checkMandatoryArgs(array("name"));
    if ($mandatoryArgsRetValue != NULL) {
        return $mandatoryArgsRetValue;
    }

    $name = ControllerUtils::getArgValue("name", "");
    $colorCode = ControllerUtils::getArgValue("colorCode", 
                              $categoryColorCodes[rand(0, count($categoryColorCodes)-1)]);
    $categoryId = CategoryService::create($name, $colorCode, $userId);
    $sharedWithUsersStr = ControllerUtils::getArgValue("sharedWithUsersEmail", "");
    $sharedUserEmails = explode(",", $sharedWithUsersStr);
    foreach($sharedUserEmails as $emailAddress) {
        $emailAddress = trim($emailAddress);
        if (empty($emailAddress)) {
           continue;
        }
        $user = UserService::lookupUserByEmailAddress($emailAddress);
        if ($user == NULL) {
            // Handle this case
            Logger::debug("categoryService", "email address $emailAddress doesn't exist");
            CategoryService::createCategorySharingRequest($userId, $categoryId, NULL, $emailAddress);
        } else {
            CategoryService::createCategorySharingRequest($userId, $categoryId, $user['id'], $emailAddress);
            CategoryService::acceptCategorySharingRequest($categoryId, $user['id'], $emailAddress);
        }
    }


    $category = CategoryService::lookup($categoryId);

    if (isset($category)) {
        $retValue = ControllerUtils::getSuccessResponse($category);
    } else {
        $retValue = ControllerUtils::getErrorResponse(ErrorCodes::INTERNAL_ERROR, "Internal Error: cannot fetch category from DB");
    }
    return $retValue;



}

handleRequest();
