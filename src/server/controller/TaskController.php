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
     //Logger::debug("taskService", "return value $retValueInJson"); 
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
        } else if ($reqType == 'changePriority') {
            $retValue = handleChangePriority($userId);
            return $retValue;
        } else if ($reqType == 'saveTasksOrder') {
            $retValue = handleSaveTasksOrder($userId);
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

function handleChangePriority($userId) {
    $mandatoryArgsCheckRetValue = ControllerUtils::checkMandatoryArgs(array("taskId", "priority"));
    if ($mandatoryArgsCheckRetValue != NULL) {
        return $mandatoryArgsCheckRetValue;
    } else {
        $taskId = ControllerUtils::getArgValue("taskId", NULL);
        $priorityStr = ControllerUtils::getArgValue("priority", TaskService::TASK_PRIORITY_MEDIUM_STR);
        $priorityIntValue = TaskService::taskPriorityIntValue($priorityStr);
        TaskService::changePriority($taskId, $priorityIntValue);
        return ControllerUtils::getSuccessResponse(TRUE);
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
        $taskId = ControllerUtils::getArgValue("taskId", NULL);
        $categoryId = $_GET["categoryId"];
        $title = $_GET["title"];
        $description = ControllerUtils::getArgValue("description", NULL);
        $priorityStr = ControllerUtils::getArgValue("priority", TaskService::TASK_PRIORITY_MEDIUM_STR);

        $dueDate = $_GET["dueDate"];

        $taskId = TaskService::create($taskId, $categoryId, $title, $description, $priorityStr, $dueDate, $createdBy);
        $task = TaskService::lookupTask($taskId);
        if (isset($task)) {
            $retValue = ControllerUtils::getSuccessResponse($task);
        } else {
            $retValue = ControllerUtils::getErrorResponse(ErrorCodes::INTERNAL_ERROR, "Internal Error: cannot fetch the task from DB");
        }
        return $retValue;

    }
}

function handleSaveTasksOrder($userId) {
    $mandatoryArgsCheckRetValue = ControllerUtils::checkMandatoryArgs(array("taskIds"));
    if ($mandatoryArgsCheckRetValue != NULL) {
        return $mandatoryArgsCheckRetValue;
    } else {
        $taskIds = explode(",", ControllerUtils::getArgValue("taskIds", NULL));
        TaskService::saveTasksOrder($userId, $taskIds);
        return ControllerUtils::getSuccessResponse(TRUE);
    }

}



handleRequest();





?>
