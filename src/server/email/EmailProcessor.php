<?php

require_once (dirname(__FILE__) . "/../services/UserService.php");
require_once (dirname(__FILE__) . "/../utils/Logger.php");
require_once (dirname(__FILE__) . "/EmailUtils.php");
class EmailProcessor {
    const BATCH_SIZE= 100;
    const SLEEP_INTERVAL = 60;

    const EMAIL_SERVICE = "emailService";

    private $agentName;
    private $startLocalTime;
    private $emailSender;
    private $emailMsgGenerator;
    private $emailSendPolicy;

    private $running;

    public function __construct($agentName,
                                $emailSender,
                                $emailMsgGenerator,
                                $emailSendPolicy) {
        $this->agentName = $agentName;
        $this->emailSender = $emailSender;
        $this->emailMsgGenerator = $emailMsgGenerator;
        $this->emailSendPolicy = $emailSendPolicy;
    }

    public function shutDown() {
        $this->running = FALSE;
    }

    public function run() {
        $this->startLocalTime = localtime(time(), TRUE);

        $this->running = TRUE;
        while ($this->running) {
            $currentLocalTime = localtime(time(), TRUE);

            if ($currentLocalTime['tm_mday'] != $this->startLocalTime['tm_mday']) {
                exit(0);
            }
            $this->process();
        }
    }

    private function process() {
        list($success, $eventsOrErrMsg) = EmailUtils::getUnProcessedEvents($this->agentName, self::BATCH_SIZE);
        if ($success == FALSE) {
           Logger::error(self::EMAIL_SERVICE, 
                         "Error in fetching un-processed events, errMsg : $eventsOrErrMsg");
            sleep(self::SLEEP_INTERVAL);
        } else if (count($eventsOrErrMsg) == 0){
            Logger::debug(self::EMAIL_SERVICE, "No un-processed events fetched");
            sleep(self::SLEEP_INTERVAL);
        } else {
            for($i=0; $i < count($eventsOrErrMsg); $i++) {
                $event = $eventsOrErrMsg[$i];
                $emailSent = FALSE;
                if ($this->emailSendPolicy->shouldProcessEvent($event)) {
                    $emailSent = $this->processEvent($event);
                }
                if ($emailSent) {
                    EmailUtils::markEventAsProcessed($event['id'], time());
                } else {
                    EmailUtils::markEventAsProcessed($event['id'], NULL);
                }

            }
        }

    }

    private function getEmailAddress($event) {
        if (!empty($event['emailAddress'])) {
            return array ($event['emailAddress'], "");
        } else {
            $userId = $event['userId'];
            $user = UserService::lookupUser($userId);
            $emailAddress = $user['emailAddress'];
            if (empty($emailAddress)) {
                throw new Exception("User $userId doesn't have email address");
            }
            $fullName = '';
            if (!empty($user['firstName'])) {
                $fullName .= $user['firstName'];
            }
            if (!empty($user['lastName'])) {
                $fullName .= " " . $user['lastName'];
            }

            return array($emailAddress, $fullName);
        }

    }



    private function processEvent($event) {
        try {
            Logger::debug(self::EMAIL_SERVICE, "Processing event " . $event['id']);
            $userId = $event['userId'];
            $eventName = $event['eventName'];

            list($toAddress, $toName) = $this->getEmailAddress($event);
            $fromAddress = "taskwhiteboard@gmail.com";
            $fromName = "TaskPal";
            list($subject, $emailBody) = $this->emailMsgGenerator->getEmailMsg($event);
            
            Logger::debug(self::EMAIL_SERVICE, "Sending '$subject' msg to $toAddress");
            if (!empty($subject) || !empty($emailBody)) {
                $this->emailSender->sendHTMLEmail($fromAddress, $fromName, $toAddress, $toName, $subject, $emailBody, $eventName);
                return TRUE;
            }

        } catch (Exception $ex) {
            $eventId = $event['id'];
            $msg = $ex->getMessage();
            $trace = $ex->getTraceAsString();
            Logger::error(self::EMAIL_SERVICE, "Error in processing event $eventId, error errMs: $msg trace:$trace" );
        }
        return FALSE;


    }

}
