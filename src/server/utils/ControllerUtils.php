<?php

class ControllerUtils {

    public static function  checkMandatoryArgs($args) {
        foreach ($args as $arg) {
            if (!isset($_GET[$arg])) {
                return self::getErrorResponse(ErrorCodes::INVALID_ARGS, "Mandatory parameter $arg is missing");
            }
        }
        return NULL;
    }

    public static function getArgValue($arg, $defaultValue) {
        if (isset($_GET[$arg])) {
            return $_GET[$arg];
        } else {
            return $defaultValue;
        }
    }

    public static function getErrorResponse($errCode, $errMsg) {
        $retValue = array();
        $retValue['success'] = FALSE;
        $retValue['errCode'] = $errCode;
        $retValue['errMsg'] = $errMsg;
        return $retValue;
    }

    public static function getSuccessResponse($payload) {
        $retValue = array();
        $retValue['success'] = TRUE;
        $retValue['payload'] = $payload;
        $retValue['currTimestamp'] = time();
        return $retValue;
    }

}
