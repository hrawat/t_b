<?php

require_once (dirname(__FILE__) . "/../conf/email.conf.php");

class EmailSendPolicy {

    private static $TEST_USERS = array(
                        "503ab19d54c463_28065092",
                        "5052b35d68c1a1_32587218",
                        "5052c170cdad61_94282073");


    public function __construct() {}

    public function shouldProcessEvent($event) {
        if (EMAIL_TESTING_MODE) {
            return in_array($event['userId'], self::$TEST_USERS);
        } else {
            return TRUE;
        }

    }

}
