<?php

require_once (dirname(__FILE__) . "/../services/UserService.php");
require_once (dirname(__FILE__) . "/../services/CategoryService.php");
require_once (dirname(__FILE__) . "/../services/TaskService.php");
require_once (dirname(__FILE__) . "/NotificationEvents.php");

class EmailMsgGenerator {
    public function __construct() {

    }

    public function getEmailMsg($event) {
        $eventName = $event['eventName'];
        if ($eventName == NotificationEvents::CATEGORY_SHARED) {
            $params = $this->getCategorySharedParams($event);
            $userFullName = $params['userFullName'];
            $categoryName = $params['categoryName'];

            $subject = "$userFullName shared $categoryName with you";
            $body = "$userFullName shared $categoryName with you";
            return array($subject, $body);
        } else if ($eventName == NotificationEvents::TASK_CREATED) {
            $params = $this->getTaskEventsParams($event);

            $userFullName = $params['userFullName'];
            $categoryName = $params['categoryName'];
            $taskTitle = $params['taskTitle'];

            $subject = "$userFullName created a task in $categoryName category";
            $body = "$userFullName created '$taskTitle' task in $categoryName category";
            return array($subject, $body);

        } else if ($eventName == NotificationEvents::TASK_COMPLETED) {
            $params = $this->getTaskEventsParams($event);

            $userFullName = $params['userFullName'];
            $categoryName = $params['categoryName'];
            $taskTitle = $params['taskTitle'];

            $subject = "$userFullName completed a task in $categoryName category";
            $body = "$userFullName completed '$taskTitle' in $categoryName category";
            return array($subject, $body);

        } else if ($eventName == NotificationEvents::USER_REGISTRATION_INVITATION_EVENT) {
            $params = $this->getCategorySharedParams($event);
            $userFullName = $params['userFullName'];
            $categoryName = $params['categoryName'];

            $subject = "$userFullName shared $categoryName list with you on TaskPal app";
            $body = "<html><body>$userFullName shared $categoryName list with you on TaskPal app.
                                        To access the category click <a href='http://mytaskboard.net'> here</a></body></html>";
            return array($subject, $body);

        }else {
            return array("", "");
        }
    }

    private function getTaskEventsParams($event) {

        $categoryId = $event['categoryId'];

        $category = CategoryService::lookup($categoryId);
        $categoryName = $category['name'];

        $user = UserService::lookupUser($event['refUserId']);
        $userFullName = $user['firstName'];

        $task = TaskService::lookupTask($event['taskId']);
        $taskTitle = $task['title'];


        $retValue = array();
        $retValue['categoryName'] = $categoryName;
        $retValue['userFullName'] = $userFullName;
        $retValue['taskTitle'] = $taskTitle;
        
        return $retValue;


    }

    private function getCategorySharedParams($event) {
        $categoryId = $event['categoryId'];

        $category = CategoryService::lookup($categoryId);
        $categoryName = $category['name'];

        $categoryCreator = UserService::lookupUser($category['createdBy']);
        $userFullName = $categoryCreator['firstName'];

        $retValue = array();
        $retValue['userFullName'] = $userFullName;
        $retValue['categoryName'] = $categoryName;

        return $retValue;
    }

}
