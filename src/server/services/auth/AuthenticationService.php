<?php

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
                'appId'  => 'YOUR_APP_ID',
                'secret' => 'YOUR_APP_SECRET',
            ));

            // See if there is a user from a cookie
            $user = $facebook->getUser();
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

    public static function getFBUserDetails() {

    }

}
