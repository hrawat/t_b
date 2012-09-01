<?php

require_once(dirname(__FILE__) . "/../services/AuthenticationService.php");
require_once(dirname(__FILE__) . "/../services/TaskService.php");
require_once(dirname(__FILE__) . "/../services/UserService.php");
require_once(dirname(__FILE__) . "/../utils/ErrorCodes.php");
require_once(dirname(__FILE__) . "/../utils/ControllerUtils.php");
require_once(dirname(__FILE__) . "/../utils/Logger.php");

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
     Logger::debug("taskService", "return value $retValueInJson"); 
    echo $retValueInJson;
}

function handleRequestInternal($userId) {
    try {
        $reqType = $_GET['reqType'];
        if ($reqType == 'create') {
            $retValue = handleCreate($userId);
            return $retValue;
        } else if ($reqType == 'userTasks') {
            $retValue = handleUserTasks($userId);
            return $retValue;
        } else if ($reqType == 'complete') {
            $retValue = handleComplete($userId);
            return $retValue;
        } else if ($reqType == 'delete') {
            $retValue = handleDelete($userId);
            return $retValue;
        }else {
            $retValue = ControllerUtils::getErrorResponse(ErrorCodes::INVALID_REQUEST, "Request $reqType is not supported");
            return $retValue;
        }
    } catch (Exception $ex) {
        $retValue = ControllerUtils::getErrorResponse(ErrorCodes::INTERNAL_ERROR, $ex->getMessage());
        return $retValue;
    }

}

function handleComplete($userId) {
    $mandatoryArgsCheckRetValue = ControllerUtils::checkMandatoryArgs(array("taskId"));
    if ($mandatoryArgsCheckRetValue != NULL) {
        return $mandatoryArgsCheckRetValue;
    } else {
        $taskId = ControllerUtils::getArgValue("taskId", NULL);
        //todo: add check that the logged in user owns the task
        TaskService::complete($taskId, $userId);
        return ControllerUtils::getSuccessResponse(TRUE);
    }
}

function handleDelete($userId) {
    $mandatoryArgsCheckRetValue = ControllerUtils::checkMandatoryArgs(array("taskId"));
    if ($mandatoryArgsCheckRetValue != NULL) {
        return $mandatoryArgsCheckRetValue;
    } else {
        $taskId = ControllerUtils::getArgValue("taskId", NULL);
        //todo: add check that the logged in user owns the task
        TaskService::delete($taskId);
        return ControllerUtils::getSuccessResponse(TRUE);
    }
}

function handleUserTasks($userId) {
    $updatedSince = ControllerUtils::getArgValue("updatedSince", 0);
    $userTasks = TaskService::userTasks($userId, $updatedSince);
    return ControllerUtils::getSuccessResponse($userTasks);

}

function handleCreate($createdBy) {
    $mandatoryArgsCheckRetValue = ControllerUtils::checkMandatoryArgs(array("categoryId", "title", "dueDate"));
    if ($mandatoryArgsCheckRetValue != NULL) {
        return $mandatoryArgsCheckRetValue;
    } else {
        $categoryId = $_GET["categoryId"];
        $title = $_GET["title"];
        $description = ControllerUtils::getArgValue("description", NULL);
        $priorityStr = ControllerUtils::getArgValue("priority", TaskService::TASK_PRIORITY_MEDIUM_STR);
        $priority = TaskService::taskPriorityIntValue($priorityStr);
        $dueDate = $_GET["dueDate"];

        $taskId = TaskService::create($categoryId, $title, $description, $priority, $dueDate, $createdBy);
        $task = TaskService::lookupTask($taskId);
        if (isset($task)) {
            $retValue = ControllerUtils::getSuccessResponse($task);
        } else {
            $retValue = ControllerUtils::getErrorResponse(ErrorCodes::INTERNAL_ERROR, "Internal Error: cannot fetch the task from DB");
        }
        return $retValue;

    }
}



handleRequest();





?>
