<?php

require_once (dirname(__FILE__) . "/../utils/DBUtils.php");

class TaskService {

    const TASK_SERVICE = "taskService";

    const TASK_STATUS_ACTIVE = 1;
    const TASK_STATUS_COMPLETED = 2;

    const TASK_PRIORITY_LOW = 1;
    const TASK_PRIORITY_MEDIUM = 2;
    const TASK_PRIORITY_HIGH = 3;

    const TASK_PRIORITY_LOW_STR = 'lowPriority';
    const TASK_PRIORITY_MEDIUM_STR = 'mediumPriority';
    const TASK_PRIORITY_HIGH_STR = 'highPriority';

    public static function taskPriorityIntValue($strValue) {
        if ($strValue == self::TASK_PRIORITY_HIGH_STR) {
            return self::TASK_PRIORITY_HIGH;
        } else if ($strValue == self::TASK_PRIORITY_MEDIUM_STR) {
            return self::TASK_PRIORITY_MEDIUM;
        } else if ($strValue == self::TASK_PRIORITY_LOW_STR) {
            return self::TASK_PRIORITY_LOW;
        }
    }

    public static function lookupTask($taskId) {
        $taskIdDbValue = DBUtils::escapeStrValue($taskId);
        $sqlStmt = "Select id, UNIX_TIMESTAMP(creationDate) as creationDate,
                                                UNIX_TIMESTAMP(lastModificationDate) as lastModificationDate,
                                                categoryId, title, description,
                                                UNIX_TIMESTAMP(dueDate), status, createdBy, priority
                                                from Task where id=$taskIdDbValue and deleted=0";
        $result = DBUtils::execute($sqlStmt);
        if ($result == FALSE) {
            Logger::error(self::TASK_SERVICE, "Error in executing sql stmt [$sqlStmt], error " . mysql_error());
            throw new Exception("Error in executing sql stmt [$sqlStmt], error " . mysql_error());
        } else {
            $task = mysql_fetch_assoc($result);
            if ($task == FALSE) {
                return NULL;
            } else {
                return $task;
            }
        }

    }

    public static function create($categoryId, $title, $description, $priority, $dueDate, $createdBy) {
        $id = DBUtils::generateUniqId();
        $idDbValue = DBUtils::escapeStrValue($id);
        $categoryIdDbValue = DBUtils::escapeStrValue($categoryId);
        $titleDbValue = DBUtils::escapeStrValue($title);
        $descriptionDbValue = DBUtils::escapeStrValue($description);

        $status = self::TASK_STATUS_ACTIVE;

        $createdByDbValue = DBUtils::escapeStrValue($createdBy);

        $sqlStmt = "Insert into Task(id, creationDate, lastModificationDate, deleted,
                                        categoryId, title, description, dueDate, status, createdBy, priority)
                                        value($idDbValue, NOW(), NOW(), 0, $categoryIdDbValue, $titleDbValue,
                                                    $descriptionDbValue, FROM_UNIXTIME($dueDate), $status,
                                                        $createdByDbValue, $priority)";
        $result = DBUtils::execute($sqlStmt);
        if ($result == FALSE) {
            Logger::error(self::TASK_SERVICE, "Error in executing sql stmt [$sqlStmt], error " . mysql_error());
            throw new Exception("Error in executing sql stmt [$sqlStmt], error " . mysql_error());
        } else {
            return $id;
        }
    }

    public static function delete($taskId, $softDelete=TRUE) {
        $taskIdDbValue = DBUtils::escapeStrValue($taskId);
        if ($softDelete) {
            $sqlStmt = "Update Task set deleted=1, lastModificationDate=NOW() where id=$taskIdDbValue";
        } else {
            $sqlStmt = "Delete from Task where id=$taskIdDbValue";
        }

        $result = DBUtils::execute($sqlStmt);
        if ($result == FALSE) {
            Logger::error(self::TASK_SERVICE, "Error in executing sql stmt [$sqlStmt], error " . mysql_error());
            throw new Exception("Error in executing sql stmt [$sqlStmt], error " . mysql_error());
        }
    }

    public static function complete($taskId, $completedBy) {
        $taskIdDbValue = DBUtils::escapeStrValue($taskId);
        $completeStatus = self::TASK_STATUS_COMPLETED;
        $completedByDbValue = DBUtils::escapeStrValue($completedBy);

        $sqlStmt = "Update Task set status=$completeStatus, completedBy=$completedByDbValue,
                                        completionDate=NOW(), lastModificationDate=NOW() where id=$taskIdDbValue";
        $result = DBUtils::execute($sqlStmt);
        if ($result == FALSE) {
            Logger::error(self::TASK_SERVICE, "Error in executing sql stmt [$sqlStmt], error " . mysql_error());
            throw new Exception("Error in executing sql stmt [$sqlStmt], error " . mysql_error());
        }

    }

    public static function changePriority($taskId, $newPriority) {
        $taskIdDbValue = DBUtils::escapeStrValue($taskId);

        $sqlStmt = "Update Task set priority=$newPriority, lastModificationDate=NOW() where id=$taskIdDbValue";
        $result = DBUtils::execute($sqlStmt);
        if ($result == FALSE) {
            Logger::error(self::TASK_SERVICE, "Error in executing sql stmt [$sqlStmt], error " . mysql_error());
            throw new Exception("Error in executing sql stmt [$sqlStmt], error " . mysql_error());
        }
    }

    public static function userTasks($userId, $updatedSince=0) {
        $userIdDbValue = DBUtils::escapeStrValue($userId);
        $sqlStmt = "Select id, UNIX_TIMESTAMP(creationDate) as creationDate,
                                                UNIX_TIMESTAMP(lastModificationDate) as lastModificationDate,
                                                categoryId, title, description,
                                                UNIX_TIMESTAMP(dueDate) as dueDate, status, createdBy, priority
                            from Task where categoryId in (select categoryId from CategoryUser where userId =$userIdDbValue)
                            and UNIX_TIMESTAMP(lastModificationDate) > $updatedSince and deleted=0";
        $result = DBUtils::execute($sqlStmt);
        if ($result == FALSE) {
            Logger::error(self::TASK_SERVICE, "Error in executing sql stmt [$sqlStmt], error " . mysql_error());
            throw new Exception("Error in executing sql stmt [$sqlStmt], error " . mysql_error());
        } else {
            $tasks = array();
            while (($taskRow = mysql_fetch_assoc($result)) != FALSE) {
                $tasks[] = $taskRow;
            }
            return $tasks;

        }

    }

    public static function changeDueDate($taskId, $newDueDate) {
        $taskIdDbValue = DBUtils::escapeStrValue($taskId);
        $sqlStmt = "Update Task set dueDate=FROM_UNIXTIME($newDueDate), lastModificationDate=NOW() where id=$taskIdDbValue";
        $result = DBUtils::execute($sqlStmt);
        if ($result == FALSE) {
            Logger::error(self::TASK_SERVICE, "Error in executing sql stmt [$sqlStmt], error " . mysql_error());
            throw new Exception("Error in executing sql stmt [$sqlStmt], error " . mysql_error());
        }

    }

}
