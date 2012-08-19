<?php

require_once (dirname(__FILE__) . "/../../services/UserService.php");
require_once (dirname(__FILE__) . "/../../services/CategoryService.php");

class CategoryServiceTest extends PHPUnit_Framework_TestCase {

    private $fbUser1Id = "test_1", $fbUser2Id = "test_2";
    private $user1Id, $user2Id;

    protected function setUp() {
        UserService::deleteUserByFBId($this->fbUser1Id);
        UserService::deleteUserByFBId($this->fbUser2Id);

        $this->user1Id = UserService::createFBUser($this->fbUser1Id, "test_1_fn", "test_1_ln", "male", "test_1@mytaskboard.net", NULL);
        $this->user2Id = UserService::createFBUser($this->fbUser2Id, "test_2_fn", "test_2_ln", "female", "test_2@mytaskboard.net", NULL);
    }

    public function  testCategoryUsageScenario() {
        // Create a category
        $categoryId = CategoryService::create("testCategory", "0xff0000", $this->user1Id);
        $this->assertNotNull($categoryId);

        // look up non-existant category
        $category = CategoryService::lookup("non_existent");
        $this->assertNull($category);

        // look up the created category
        $category = CategoryService::lookup($categoryId);
        $this->assertNotNull($category);
        $this->assertEquals($this->user1Id, $category['createdBy']);
        $this->assertEquals(1, count($category['users']));
        $this->assertEquals("test_1_fn", $category['users'][0]['firstName']);

        // add User to category
        CategoryService::addUser($categoryId, $this->user2Id);

        // Get list of categories for both users
        $user1Categories = CategoryService::userCategories($this->user1Id);
        $this->assertEquals(1, count($user1Categories));
        $this->assertEquals($categoryId, $user1Categories[0]['id']);
        $this->assertEquals(2, count($user1Categories[0]['users']));


        $user2Categories = CategoryService::userCategories($this->user2Id);
        $this->assertEquals(1, count($user2Categories));
        $this->assertEquals($categoryId, $user2Categories[0]['id']);
        $this->assertEquals(2, count($user2Categories[0]['users']));

        // delete the category
        CategoryService::delete($categoryId, FALSE);

    }


}
