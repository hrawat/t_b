<?php

require_once (dirname(__FILE__) . "/../conf/database.conf.php");
require_once (dirname(__FILE__) . "/Logger.php");

class DBUtils {

    public static function generateUniqId() {
        $id = uniqid("", TRUE);
        $id = str_replace(".", "_", $id);
        $id = str_replace(",", "_", $id);
        return $id;
    }

    public static function execute($sqlStmt) {
        $dbConn = self::getDbConn();
        Logger::debug("database", "Executing sql stmt [$sqlStmt]");
        $result = mysql_query($sqlStmt, $dbConn);
        return $result;
    }

    private static function getDbConn() {
        $host = MYTASKBOARD_DB_HOST;
        if (TEST_MODE) {
            $host = MYTASKBOARD_TEST_DB_HOST;
        }
        $dbConn = mysql_pconnect($host, MYTASKBOARD_USER, MYTASKBOARD_PASSWORD);
        mysql_select_db(MYTASKBOARD_DB_NAME, $dbConn);
        return $dbConn;
    }

    public static function escapeStrValue($str) {
        if (isset($str)) {
            $dbConn = self::getDbConn();
            $escapedValue =  mysql_real_escape_string($str, $dbConn);
            return "'$escapedValue'";
        } else {
            return "NULL";
        }

    }

}
