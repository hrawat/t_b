<?php

require_once (dirname(__FILE__) . "/../../lib/facebook-php-sdk/facebook.php");
require_once(dirname(__FILE__) . "/../../services/user/UserService.php");
require_once(dirname(__FILE__) . "/../../utils/Logger.php");

class AuthenticationService {

    const UID_KEY = "uid";

    private static $faceBookInstance;

    private static function getFaceBookInstance() {
        if (self::$faceBookInstance == NULL) {
            self::$faceBookInstance = new Facebook(array(
                'appId'  => '420637114648782',
                'secret' => '202d56805a3f75acd1a8f2e0e941acfb',
            ));
        }
        return self::$faceBookInstance;
    }

    /**
     * @static
     * Return logged in user id. Identify logged in user thru two mechanisms - our session or
     * thru FB and do auto provisioning
     */
    public static function getLoggedInUserId() {
        $uid = self::getUidFromSession();
        if ($uid == NULL) {
            // Get the session from FB
            $faceBook = self::getFaceBookInstance();
            // See if there is a user from a cookie
            $fbUid = $faceBook->getUser();
            if ($fbUid == 0) {
                error_log("did not get user from signed cookie");
                return NULL;
            } else {
                $uid = self::lookupOrCreateFBUser($fbUid);
                if (isset($uid)) {
                    self::setUidInSession($uid);
                }
                return $uid;
            }
        } else {
            return $uid;
        }
    }


    private static function getUidFromSession() {
        $uid = NULL;
        if (isset($_SESSION[self::UID_KEY])) {
            $uid = $_SESSION[self::UID_KEY];
        }
        return $uid;
    }

    private static function setUidInSession($uid) {
        session_start();
        $_SESSION[self::UID_KEY] = $uid;

    }

    private static function lookupOrCreateFBUser($fbUid) {
        $user = UserService::lookupUserByFaceBookUid($fbUid);
        if ($user == NULL) {
            $faceBook = self::getFaceBookInstance();
            $userProfile = $faceBook->api("/me");
            if (isset($userProfile)) {
                $uid = UserService::createFBUser($fbUid, $userProfile['first_name'],
                                                        $userProfile['last_name'], $userProfile['gender'],
                                                        $userProfile['email'], NULL);
                return $uid;
            } else {
                Logger::error("Couldn't get details of $fbUid");
                return NULL;
            }
        } else {
            return $user['id'];
        }
    }

}
