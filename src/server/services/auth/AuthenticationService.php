<?php

require_once (dirname(__FILE__) . "/../../lib/facebook-php-sdk/facebook.php");

class AuthenticationService {

    const UID_KEY = "uid";

    /**
     * @static
     * Return logged in user id. Identify logged in user thru two mechanisms - our session or
     * thru FB
     */
    public static function getLoggedInUserId() {
        $uid = self::getUidFromSession();
        if ($uid == NULL) {
            // Get the session from FB
            $facebook = new Facebook(array(
                'appId'  => '420637114648782',
                'secret' => '202d56805a3f75acd1a8f2e0e941acfb',
            ));

            // See if there is a user from a cookie
            $fbUid = $facebook->getUser();
            if ($fbUid == 0) {
                error_log("did not get user from signed cookie");
                return NULL;
            } else {
                $user = UserService::lookupUserByFaceBookUid($fbUid);
                if ($user == NULL) {
                    $userProfile = $facebook->api("/me");
                    $uid = UserService::createUser();
                } else {
                    $uid = $user['id'];
                }



            }
        }
    }


    public static function isValidSession() {
        session_start();
        $uid = self::getUidFromSession();
        if (isset($uid)) {
            return TRUE;
        } else {
            return FALSE;
        }
    }

    public static function getUidFromSession() {
        $uid = NULL;
        if (isset($_SESSION[self::UID_KEY])) {
            $uid = $_SESSION[self::UID_KEY];
        }
        return $uid;
    }

    public static function setUidInSession($uid) {
        session_start();
        $_SESSION[self::UID_KEY] = $uid;

    }

}
