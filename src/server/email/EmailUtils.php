<?php

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

}
