<?php

require_once (dirname(__FILE__) . "/../../services/TaskService.php");

class TaskServiceTest extends PHPUnit_Framework_TestCase {

    private $homeCategory = "home";
    private $userId = "test_user";

    protected function setUp(){}

    protected function tearDown() {}

    public function  testSimpleScenario() {
        // Create task
        $taskId = TaskService::create($this->homeCategory, "task1_title", "task1_desc", TaskService::TASK_PRIORITY_MEDIUM, time()+86400, $this->userId);
        $this->assertNotNull($taskId);

        // Change priority
        TaskService::changePriority($taskId, TaskService::TASK_PRIORITY_HIGH);

        // Change due date
        TaskService::changeDueDate($taskId, time()+10*86400);

        // Complete Task
        TaskService::complete($taskId, $this->userId);

        // Soft Delete Task
        TaskService::delete($taskId);

        // hard delete
        TaskService::delete($taskId, FALSE);


    }


}
