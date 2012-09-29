<?php

require_once (dirname(__FILE__) . "/../utils/DBUtils.php");
require_once (dirname(__FILE__) . "/../utils/Logger.php");

require_once (dirname(__FILE__) . "/../email/EmailUtils.php");
require_once (dirname(__FILE__) . "/../email/NotificationEvents.php");

// todo: the code is just functional - it doesn't check if the user modifying a category is indeed the owner of the category
class CategoryService {

    const CATEGORY_SERVICE = "categoryService";

    const CATEGORY_USER_TYPE_OWNER = 1;
    const CATEGORY_USER_TYPE_COLLABORATOR = 2;

    const CATEGORY_SHARING_REQUEST_SENT = 0;
    const CATEGORY_SHARING_REQUEST_ACCEPTED= 1;
    const CATEGORY_SHARING_REQUEST_REJECTED = 2;

    public static function lookup($categoryId) {
        // Get category name and color code
        $categoryIdDbValue = DBUtils::escapeStrValue($categoryId);
        $sqlStmt = "select id, name, colorCode, createdBy from Category where id=$categoryIdDbValue";
        $result = DBUtils::execute($sqlStmt);
        if ($result == FALSE) {
            Logger::error(self::CATEGORY_SERVICE, "Error in executing sql stmt [$sqlStmt] error " . mysql_error());
            throw new Exception("Error in executing sql stmt [$sqlStmt] error " . mysql_error());
        } else {
            $row = mysql_fetch_assoc($result);
            if ($row == FALSE) {
                return NULL;
            }
            $category = $row;
        }

        // Get all the users of the category
        $sqlStmt = "select User.id as userId, firstName, lastName, fbUid from User, CategoryUser
                                    where User.id = CategoryUser.userId and CategoryUser.categoryId=$categoryIdDbValue";
        $result = DBUtils::execute($sqlStmt);
        if ($result == FALSE) {
            Logger::error(self::CATEGORY_SERVICE, "Error in executing sql stmt [$sqlStmt] error " . mysql_error());
            throw new Exception("Error in executing sql stmt [$sqlStmt] error " . mysql_error());
        } else {
            $category['users'] = array();
            while (($row = mysql_fetch_assoc($result)) != FALSE) {
                $fbUid = $row['fbUid'];
                $row['avatarUrl_small'] = "http://graph.facebook.com/$fbUid/picture/type=small";
                $row['avatarUrl_normal'] = "http://graph.facebook.com/$fbUid/picture/type=normal";
                array_push($category['users'], $row);
            }
        }

        return $category;

    }

    public static function create($name, $colorCode, $createdBy) {
        $id = DBUtils::generateUniqId();
        $idDbValue = DBUtils::escapeStrValue($id);
        $nameDbValue = DBUtils::escapeStrValue($name);
        $colorCodeDbValue = DBUtils::escapeStrValue($colorCode);
        $createdByDbValue = DBUtils::escapeStrValue($createdBy);

        $sqlStmt = "Insert into Category(id, creationDate, lastModificationDate, deleted, name, colorCode, createdBy)
                                value($idDbValue, NOW(), NOW(), 0, $nameDbValue, $colorCodeDbValue, $createdByDbValue)";
        $result = DBUtils::execute($sqlStmt);
        if ($result == FALSE) {
            Logger::error(self::CATEGORY_SERVICE, "Error in executing sql stmt [$sqlStmt] error " . mysql_error());
            throw new Exception("Error in executing sql stmt [$sqlStmt] error " . mysql_error());
        } else {
            self::addUserInternal($id, $createdBy, self::CATEGORY_USER_TYPE_OWNER);
            return $id;
        }
    }

    public static function getCategorySharingRequests($emailAddress, $toUserId, $requestStatus) {
        if (!empty($emailAddress)) {
            $emailAddressDbValue = DBUtils::escapeStrValue($emailAddress);
            $sqlStmt = "select * from CategorySharingRequest where toEmailAddress=$emailAddressDbValue and status=$requestStatus";
        } else {
            $toUserIdDbValue = DBUtils::escapeStrValue($toUserId);
            $sqlStmt = "select * from CategorySharingRequest where toUserId=$toUserIdDbValue and status=$requestStatus";
        }
        $result = DBUtils::execute($sqlStmt);
        if ($result == FALSE) {
            Logger::error(self::CATEGORY_SERVICE, "Error in executing sql stmt [$sqlStmt] error " . mysql_error());
            throw new Exception("Error in executing sql stmt [$sqlStmt] error " . mysql_error());
        } else {
            $retValue = array();
            while (($row = mysql_fetch_assoc($result))) {
                $retValue[] = $row;
            }
            return $retValue;
        }
    }


    public static function createCategorySharingRequest($fromUserId, $categoryId, $toUserId, $toEmailAddress) {
        if (empty($toUserId) && empty($toEmailAddress)) {
            throw new Exception("Both toUserId and toEmailAddress cannot be null");
        }
        $fromUserIdDbValue = DBUtils::escapeStrValue($fromUserId);
        $categoryIdDbValue = DBUtils::escapeStrValue($categoryId);
        $toUserIdDbValue = DBUtils::escapeStrValue($toUserId);
        $toEmailAddressDbValue = DBUtils::escapeStrValue($toEmailAddress);
        $statusDbValue = self::CATEGORY_SHARING_REQUEST_SENT;
        $sqlStmt = "Insert into CategorySharingRequest(creationDate, fromUserId, categoryId, toUserId, toEmailAddress, status)
                            values (NOW(),$fromUserIdDbValue, $categoryIdDbValue, $toUserIdDbValue, $toEmailAddressDbValue, $statusDbValue)";
        $result = DBUtils::execute($sqlStmt);
        if ($result == FALSE) {
            Logger::error(self::CATEGORY_SERVICE, "Error in executing sql stmt [$sqlStmt] error " . mysql_error());
            throw new Exception("Error in executing sql stmt [$sqlStmt] error " . mysql_error());
        } else {
            if (empty($toUserId)) {
                EmailUtils::logEvent(NotificationEvents::USER_REGISTRATION_INVITATION_EVENT, NULL, $toEmailAddress, $categoryId, NULL, NULL, 0);
            }
            return mysql_insert_id();
        }
    }

    public static function acceptCategorySharingRequest($categoryId, $toUserId, $toEmailAddress) {
        $statusDbValue = self::CATEGORY_SHARING_REQUEST_ACCEPTED;
        $affectedRequests = self::setCategorySharingRequestStatus($categoryId, $toUserId, $toEmailAddress, $statusDbValue);
        if ($affectedRequests > 0) {
            self::addUser($categoryId, $toUserId);
        }
    }

    public static function rejectCategorySharingRequest($categoryId, $toUserId, $toEmailAddress) {
        $statusDbValue = self::CATEGORY_SHARING_REQUEST_REJECTED;
        $affectedRequests = self::setCategorySharingRequestStatus($categoryId, $toUserId, $toEmailAddress, $statusDbValue);
    }

    private static function setCategorySharingRequestStatus($categoryId, $toUserId, $toEmailAddress, $statusDbValue) {
        $categoryIdDbValue = DBUtils::escapeStrValue($categoryId);
        if (!empty($toUserId)) {
            $toEmailAddressDbValue = DBUtils::escapeStrValue($toEmailAddress);
            $sqlStmt = "Update CategorySharingRequest set status=$statusDbValue, lastModificationDate=NOW() where
                                    categoryId=$categoryIdDbValue and toEmailAddress=$toEmailAddressDbValue";
        } else {
            $toUserIdDbValue = DBUtils::escapeStrValue($toUserId);
            $sqlStmt = "Update CategorySharingRequest set status=$statusDbValue where
                                    categoryId=$categoryIdDbValue and  toUserId=$toUserIdDbValue";
        }
        $result = DBUtils::execute($sqlStmt);
        if ($result == FALSE) {
            Logger::error(self::CATEGORY_SERVICE, "Error in executing sql stmt [$sqlStmt] error " . mysql_error());
            throw new Exception("Error in executing sql stmt [$sqlStmt] error " . mysql_error());
        } else {
            return mysql_affected_rows();
        }
    }


    public static function addUser($categoryId, $userId, $sendNotification=TRUE) {
        self::addUserInternal($categoryId, $userId, self::CATEGORY_USER_TYPE_COLLABORATOR);
        if ($sendNotification) {
            EmailUtils::logEvent(NotificationEvents::CATEGORY_SHARED, $userId, NULL, $categoryId, NULL, NULL, 0);
        }

    }

    private static function addUserInternal($categoryId, $userId, $type) {
        $categoryIdDbValue = DBUtils::escapeStrValue($categoryId);
        $userIdDbValue = DBUtils::escapeStrValue($userId);

        $sqlStmt = "Insert into CategoryUser(categoryId, userId, type, creationDate)
                            values($categoryIdDbValue, $userIdDbValue, $type, NOW())";
        $result = DBUtils::execute($sqlStmt);
        if ($result == FALSE) {
            Logger::error(self::CATEGORY_SERVICE, "Error in executing sql stmt [$sqlStmt] error " . mysql_error());
            throw new Exception("Error in executing sql stmt [$sqlStmt] error " . mysql_error());
        }
    }

    public static function userCategories($userId) {

        $userIdDbValue = DBUtils::escapeStrValue($userId);
        $sqlStmt = "select categoryId from CategoryUser where userId=$userIdDbValue";
        $result = DBUtils::execute($sqlStmt);
        if ($result == FALSE) {
            Logger::error(self::CATEGORY_SERVICE, "Error in executing sql stmt [$sqlStmt] error " . mysql_error());
            throw new Exception("Error in executing sql stmt [$sqlStmt] error " . mysql_error());
        } else {
            $categories = array();
            while (($row = mysql_fetch_assoc($result)) != FALSE) {
                $category = self::lookup($row['categoryId']);
                array_push($categories, $category);
            }
            return $categories;
        }

    }

    public static function delete($categoryId, $softDelete=TRUE) {
        $categoryIdDbValue = DBUtils::escapeStrValue($categoryId);

        if ($softDelete) {
            $sqlStmt = "Update Category set deleted=1 where categoryId=$categoryIdDbValue";
        } else {
            $sqlStmt = "Delete from Category where id=$categoryIdDbValue";
        }
        $result = DBUtils::execute($sqlStmt);
        if ($result == FALSE) {
            Logger::error(self::CATEGORY_SERVICE, "Error in executing sql stmt [$sqlStmt] error " . mysql_error());
            throw new Exception("Error in executing sql stmt [$sqlStmt] error " . mysql_error());
        }
    }

    public static function changeColorCode($categoryId, $colorCode) {
        $categoryIdDbValue = DBUtils::escapeStrValue($categoryId);
        $colorCodeDbValue = DBUtils::escapeStrValue($colorCode);

        $sqlStmt = "Update Category set colorCode=$colorCodeDbValue where categoryId=$categoryIdDbValue";
        $result = DBUtils::execute($sqlStmt);
        if ($result == FALSE) {
            Logger::error(self::CATEGORY_SERVICE, "Error in executing sql stmt [$sqlStmt] error " . mysql_error());
            throw new Exception("Error in executing sql stmt [$sqlStmt] error " . mysql_error());
        }
    }

    public static function deleteCategoriesOfUser($userId) {
        $userIdDbValue = DBUtils::escapeStrValue($userId);
        $sqlStmt = "Delete from Category where createdBy=$userIdDbValue";
        $result = DBUtils::execute($sqlStmt);
        if ($result == FALSE) {
            Logger::error(self::CATEGORY_SERVICE, "Error in executing sql stmt [$sqlStmt] error " . mysql_error());
            throw new Exception("Error in executing sql stmt [$sqlStmt] error " . mysql_error());
        }

    }

}
