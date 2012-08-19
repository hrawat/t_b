<?php

require_once (dirname(__FILE__) . "/../utils/DBUtils.php");
require_once (dirname(__FILE__) . "/../utils/Logger.php");

class UserService {

    const USER_SERVICE = "userService";

    const USER_TYPE_FACEBOOK = 1;

    const USER_STATUS_REGISTERED = 1;

    public static function lookupUserByFaceBookUid($fbUid) {
        $fbUidDbValue = DBUtils::escapeStrValue($fbUid);
        return self::lookupUserInternal("fbUid=$fbUidDbValue and deleted=0");
    }


    public static function lookupUser($id) {
        $idDbValue = DBUtils::escapeStrValue($id);
        return self::lookupUserInternal("id=$idDbValue");
    }



    public static function createFBUser($fbUid, $firstName, $lastName, $gender, $emailAddress, $invitedBy) {
        $id = uniqid("", TRUE);
        $idDbValue = DBUtils::escapeStrValue($id);
        $type = self::USER_TYPE_FACEBOOK;
        $status = self::USER_STATUS_REGISTERED;
        $fbUidDbValue = DBUtils::escapeStrValue($fbUid);
        $firstNameDbValue = DBUtils::escapeStrValue($firstName);
        $lastNameDbValue = DBUtils::escapeStrValue($lastName);
        $genderDbValue = (strcasecmp($gender, "male") == 0) ? "'M'" : ((strcasecmp($gender, "female") == 0) ? "'F'" : "''");
        $emailAddressDbValue = DBUtils::escapeStrValue($emailAddress);
        $invitedByDbValue = DBUtils::escapeStrValue($invitedBy);

        $sqlStmt = "Insert into User(id, creationDate, lastModificationDate, type, status, fbUid, firstName,
                                                    lastName, gender, emailAddress, invitedBy, deleted)
                                                     values($idDbValue, NOW(), NOW(),$type, $status, $fbUidDbValue,
                                                              $firstNameDbValue, $lastNameDbValue, $genderDbValue, $emailAddressDbValue,
                                                              $invitedByDbValue, 0)";
        $result = DBUtils::execute($sqlStmt);
        if ($result == FALSE) {
            Logger::error(self::USER_SERVICE, "Error in executing sql stmt [$sqlStmt], error " . mysql_error());
            throw new Exception("Error in executing sql stmt [$sqlStmt], error " . mysql_error());
        } else {
            return $id;
        }

    }

    public static function deleteUserByFBId($fbUid) {
        $fbUidDbValue = DBUtils::escapeStrValue($fbUid);
        $sqlStmt = "Delete from User where fbUid = $fbUidDbValue";
        $result = DBUtils::execute($sqlStmt);
        if ($result == FALSE) {
            Logger::error(self::USER_SERVICE, "Error in executing sql stmt $sqlStmt, error : " . mysql_error());
            throw new Exception("Error in executing sql stmt $sqlStmt, error : " . mysql_error());
        }
        return TRUE;
    }

    private static function lookupUserInternal($criteria) {
        $sqlStmt = "Select id, UNIX_TIMESTAMP(creationDate) as creationDate, UNIX_TIMESTAMP(lastModificationDate) as lastModificationDate, type, status, fbUid,
                                        firstName, lastName, gender, emailAddress, dateOfBirth, invitedBy
                                        from User where $criteria";
        $result = DBUtils::execute($sqlStmt);
        if ($result == FALSE) {
            Logger::error(self::USER_SERVICE, "Error in executing sql smt [$sqlStmt], error " . mysql_error());
            throw new Exception("Error in executing sql smt [$sqlStmt], error " . mysql_error());
        } else {
            $row = mysql_fetch_assoc($result);
            if ($row == FALSE) {
                return NULL;
            } else {
                $fbUid = $row['fbUid'];
                $row['avatarUrl_small'] = "http://graph.facebook.com/$fbUid/picture/type=small";
                $row['avatarUrl_normal'] = "http://graph.facebook.com/$fbUid/picture/type=normal";
                return $row;
            }
        }
    }

}



////    id                        varchar(23) primary key,
//    creationDate              datetime,
//    lastModificationDate      datetime,
//    deleted                   tinyint(1) default 0,
//    type                      tinyint(1),
//    status                    tinyint(1),
//    fbUid                     varchar(64),
//    firstName                 varchar(64),
//    lastName                  varchar(64),
//    gender                    char(1),
//    emailAddress              varchar(128),
//    dateOfBirth               date,
//    invitedBy                 varchar(23)
