<?php

require_once(dirname(__FILE__) . "/../conf/email.conf.php");
class MandrillEmailSender {
    public function __construct() {

    }

    public function sendHTMLEmail($fromEmailAddress, $fromName, $toAddress, $toName, $subject, $body, $tags=NULL) {
        $emailRequest = array();
        $emailRequest['key'] = MANDRILL_API_KEY;
        $emailRequest['message'] = array();
        $emailRequest['message']['from_email'] = $fromEmailAddress;
        $emailRequest['message']['from_name'] = $fromName;
        $emailRequest['message']['to'] = array();
        $recipient = array();
        $recipient['email'] = $toAddress;
        $recipient['name'] = $toName;
        array_push($emailRequest['message']['to'], $recipient);

        $emailRequest['message']['subject'] = $subject;

        $emailRequest['message']['html'] = $body;

        $emailRequest['message']['track_opens'] = TRUE;
        $emailRequest['message']['track_clicks'] = TRUE;

        if (isset($tags)) {
            if (is_array($tags)) {
                $emailRequest['message']['tags'] = $tags;
            } else {
                $emailRequest['message']['tags'] = array();
                $emailRequest['message']['tags'][] = $tags;
            }
        }
        // $emailRequest['message']['tags'] = array();

        $emailRequestInJson = json_encode($emailRequest);
        list($success, $response) = $this->sendPostRequestToMandrill(MANDRILL_SEND_API_URL, $emailRequestInJson);
        if ($success == FALSE) {
            throw new Exception("Got invalid response from email server, response : $response");
        } else {
            return array(TRUE, $response);
        }

    }

    private static function sendPostRequestToMandrill($url, $body) {
        $ch = curl_init();
        curl_setopt($ch, CURLOPT_URL, $url);
        curl_setopt($ch, CURLOPT_HTTPHEADER, array("Content-Type: application/json"));
        curl_setopt($ch, CURLOPT_RETURNTRANSFER, 1);
        curl_setopt($ch, CURLOPT_POST, 1);
        curl_setopt($ch, CURLOPT_POSTFIELDS, $body);
        $response = curl_exec($ch);
        $httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
        curl_close($ch);
        if ($httpCode != 200) {
            return array(FALSE, $response);
        }
        return array(TRUE, $response);

    }

}
