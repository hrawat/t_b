<?php

require_once (dirname(__FILE__) . "/../utils/DbUtils.php");
require_once (dirname(__FILE__) . "/../utils/Logger.php");

class EmailUtils {

    const EMAIL_SERVICE = "emailService";

    public static function logEvent($eventName, $userId, $categoryId, $taskId, $refUserId, $processAfterSecs) {
        $eventNameDbValue = DBUtils::escapeStrValue($eventName);
        $userIdDbValue = DBUtils::escapeStrValue($userId);
        $categoryIdDbValue = DBUtils::escapeStrValue($categoryId);
        $taskIdDbValue = DBUtils::escapeStrValue($taskId);
        $refUserIdDbValue = DBUtils::escapeStrValue($refUserId);


        $sqlStmt = "Insert into Notification(eventDate, eventName, userId, categoryId, taskId, refUserId, emailProcessingTime)
                                    values(NOW(), $eventNameDbValue, $userIdDbValue,
                                              $categoryIdDbValue, $taskIdDbValue, $refUserIdDbValue, ADDDATE(NOW(), INTERVAL $processAfterSecs SECOND))";
        $result = DBUtils::execute($sqlStmt);
        if ($result == FALSE) {
            Logger::error(self::EMAIL_SERVICE, "Error in executing sql stmt [$sqlStmt], error " . mysql_error());
            throw new Exception("Error in executing sql stmt [$sqlStmt], error " . mysql_error());
        } else {
            return mysql_insert_id();
        }
    }

    public static function getUnProcessedEvents($agentName, $count) {
        $agentNameDbValue = DBUtils::escapeStrValue($agentName);
        $processingState = 1;
        $sqlStmt = "update Notification set emailStatus=$processingState, agentName=$agentNameDbValue
                                    where (agentName is null or agentName=$agentNameDbValue) and
                                                (emailStatus=0 or emailStatus=1) and
                                                 (emailProcessingTime > NOW())
                                                order by emailPriority desc, eventId asc limit $count";
        $result = DBUtils::execute($sqlStmt);
        if ($result == FALSE) {
            Logger::error(self::EMAIL_SERVICE, "Error in executing sql stmt [$sqlStmt], error " . mysql_error());
            throw new Exception("Error in executing sql stmt [$sqlStmt], error " . mysql_error());
        } else {
            return self::getUnprocessedEventsLockedByAgent($agentName);
        }


    }

    private static function getUnprocessedEventsLockedByAgent($agentName) {
        $agentNameDbValue = DBUtils::escapeStrValue($agentName);
        $processingState = 1;
        $sqlStmt = "select id, eventName, UNIX_TIMESTAMP(eventDate) as eventDate, userId, categoryId, taskId, refUserId
                                                from Notification where emailStatus=$processingState and agentName=$agentNameDbValue";
        $result = DBUtils::execute($sqlStmt);
        if ($result == FALSE) {
            Logger::error(self::EMAIL_SERVICE, "Error in executing sql stmt [$sqlStmt], error " . mysql_error());
            throw new Exception("Error in executing sql stmt [$sqlStmt], error " . mysql_error());
        } else {
            $retValue = array();
            while (($row = mysql_fetch_assoc($result)) != FALSE) {
                array_push($retValue, $row);
            }
            return array(TRUE, $retValue);
        }
    }

    public static function markEventAsProcessed($eventId, $emailSentDate) {
        $statusDbValue = 2;
        if (isset($emailSentDate)) {
            $emailSentDateValue = "FROM_UNIXTIME($emailSentDate)";
        } else {
            $emailSentDateValue = "NULL";
        }
        $sqlStmt = "Update Notification set emailStatus=$statusDbValue, emailSentDate=$emailSentDateValue where id=$eventId";
        $result = DBUtils::execute($sqlStmt);
        if ($result == FALSE) {
            Logger::error(self::EMAIL_SERVICE, "Error in executing sql stmt [$sqlStmt], error " . mysql_error());
            throw new Exception("Error in executing sql stmt [$sqlStmt], error " . mysql_error());
        }  else {
            return array(TRUE, TRUE);
        }

    }

}
