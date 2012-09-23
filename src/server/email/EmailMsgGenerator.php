<?php

require_once (dirname(__FILE__) . "/../services/UserService.php");
require_once (dirname(__FILE__) . "/../services/CategoryService.php");

class EmailMsgGenerator {
    public function __construct() {

    }

    public function getEmailMsg($event) {
        $eventName = $event['eventName'];
        if ($eventName == 'categoryShared') {
            $params = $this->getCategorySharedParams($event);
            $userFullName = $params['userFullName'];
            $categoryName = $params['categoryName'];

            $subject = "$userFullName shared $categoryName with you";
            $body = "$userFullName shared $categoryName with you";
            return array($subject, $body);
        } else {
            return array("", "");
        }
    }

    private function getCategorySharedParams($event) {
        $userId = $event['userId'];
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
