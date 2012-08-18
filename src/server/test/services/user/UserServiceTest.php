<?php

require_once (dirname(__FILE__) . "/../../../services/user/UserService.php");

class UserServiceTest extends PHPUnit_Framework_TestCase {


    private $fbUid = "test";

    protected function setUp(){
        UserService::deleteUserByFBId($this->fbUid);
    }

    protected function tearDown() {}

    public function testFBScenario() {
        // Look up for non-existing user
        $user = UserService::lookupUserByFaceBookUid($this->fbUid);
        $this->assertNull($user);


        // Create User
        $id = UserService::createFBUser($this->fbUid, "Harish", "Rawat", "male", "harish.s.rawat@myTaskboard.net", NULL);
        $this->assertNotNull($id);

        // Lookup User by ID
        $user = UserService::lookupUser($id);
        $this->checkTestUser($user);


        // Lookup User by facebook id
        $user = UserService::lookupUserByFaceBookUid($this->fbUid);
        $this->checkTestUser($user);

    }

    private function checkTestUser($user) {
        $this->assertNotNull($user);
        $this->assertEquals($this->fbUid, $user['fbUid']);
        $this->assertEquals("Harish", $user['firstName']);
        $this->assertEquals("Rawat", $user['lastName']);
        $this->assertEquals("M", $user['gender']);
        $this->assertEquals("harish.s.rawat@myTaskboard.net", $user['emailAddress']);



    }

}
