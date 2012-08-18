<?php

class Logger {

    public static function error($moduleName, $msg) {
        error_log("$moduleName : $msg");
    }

    public static function debug($moduleName, $msg) {
        error_log("$moduleName : $msg");
    }

}
