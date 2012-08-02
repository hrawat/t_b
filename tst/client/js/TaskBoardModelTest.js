function setUp() {
    localStorage.clear();
};

QUnit.testStart(setUp);

test('testCategoryModel()', function() {
    var homeCategoryId, homeCategory, workCategoryId, categories;

    // Create home category
    homeCategoryId = TaskBoard.CategoryModel.create("Home", "home.png", "0xff000000", null);
    ok(homeCategoryId != null, 'category id is not null');

    homeCategory = TaskBoard.CategoryModel.get(homeCategoryId);
    ok(homeCategory.categoryId == homeCategoryId, "task id matches");
    ok(homeCategory.name == "Home", "name matches");
    ok(homeCategory.imageURL == "home.png", "imageURL matches");

    homeCategory = TaskBoard.CategoryModel.getByName("Home");
    ok(homeCategory.categoryId == homeCategoryId, "task id matches");
    ok(homeCategory.name == "Home", "name matches");
    ok(homeCategory.imageURL == "home.png", "imageURL matches");



    categories = TaskBoard.CategoryModel.list();
    ok(categories.length ==1, "list returns one entry");
    ok(categories[0].categoryId == homeCategoryId, "first element category id is correct");
    ok(categories[0].name == "Home", "first element name is correct");
    ok(categories[0].imageURL == "home.png", "first element imageURL is correct");
    ok(categories[0].colorHexCode == "0xff000000", "first element colorHexCode is correct");


    // Create work category
    workCategoryId = TaskBoard.CategoryModel.create("Work", "work.png", "0x00ff00", null);
    categories = TaskBoard.CategoryModel.list();
    ok(categories.length ==2, "list returns two entries");
    ok(categories[0].categoryId == homeCategoryId, "home category id is correct");
    ok(categories[1].categoryId == workCategoryId, "work category id is correct");

    // Change the position of work category
    TaskBoard.CategoryModel.changePosition(workCategoryId, 0);
    categories = TaskBoard.CategoryModel.list();
    ok(categories.length ==2, "list returns two entries");
    ok(categories[0].categoryId == workCategoryId , "work category id is @ position 0");
    ok(categories[1].categoryId == homeCategoryId, "work category id is @ position 1");

    // Delete work category
    TaskBoard.CategoryModel.delete(workCategoryId);
    categories = TaskBoard.CategoryModel.list();
    ok(categories.length ==1, "list returns one entries");
    ok(categories[0].categoryId == homeCategoryId , "home category id is @ position 0");



});


test('testGetDate()', function() {
    var refDate, today, tomorrow, thisWeek, later;
    refDate = new Date(2012, 7, 26, 10, 55, 30, 10);
    today = TaskBoard.TaskModel._getDate(refDate, TaskBoard.TaskModel.TODAY);
    tomorrow = TaskBoard.TaskModel._getDate(refDate, TaskBoard.TaskModel.TOMORROW);
    thisWeek = TaskBoard.TaskModel._getDate(refDate, TaskBoard.TaskModel.THIS_WEEK);
    later = TaskBoard.TaskModel._getDate(refDate, TaskBoard.TaskModel.LATER);

    ok((today.getDate() == 26) && (today.getMonth() == 7) && (today.getFullYear() == 2012), "today's calculation is correct");


});

test('testTaskModel()', function() {
    var orderDinnerTask, orderDinnerTaskId, today, tomorrow;

    today = new Date();
    tomorrow = TaskBoard.TaskModel._getDate(today, TaskBoard.TaskModel.TOMORROW);

    // Create task
    orderDinnerTaskId = TaskBoard.TaskModel.create("Order Dinner", "Call XXX-XXX-XXXX",
                                                "homeCategoryId", TaskBoard.TaskModel.TODAY);

    ok(orderDinnerTaskId != null, "task id for order dinner task is not null");

    orderDinnerTask = TaskBoard.TaskModel.get(orderDinnerTaskId);
    ok(orderDinnerTask.title == "Order Dinner", "task title matches");
    ok(orderDinnerTask.description == "Call XXX-XXX-XXXX", "task description matches");
    ok(orderDinnerTask.categoryId == "homeCategoryId", "category id matches");
    ok(orderDinnerTask.status == TaskBoard.TaskModel.TASK_STATUS_ACTIVE, "task status is active");
    ok((orderDinnerTask.creationDate.getDate() == today.getDate()) &&
                                    (today.getMonth() == today.getMonth()) &&
                                    (today.getFullYear() == today.getFullYear()), "task creation date is correct");
    ok(orderDinnerTask.completionDate.getDate() == today.getDate(), "task completion date is correct");

    // Save task - move to tomorrow
    TaskBoard.TaskModel.save(orderDinnerTaskId, "Order Dinner", "Call XXX-XXX-XXXX",
                                                            "homeCategoryId", TaskBoard.TaskModel.TOMORROW);
    orderDinnerTask = TaskBoard.TaskModel.get(orderDinnerTaskId);
    ok((orderDinnerTask.completionDate.getDate() == tomorrow.getDate()) &&
        (orderDinnerTask.completionDate.getMonth() == tomorrow.getMonth()) &&
        (orderDinnerTask.completionDate.getFullYear() == tomorrow.getFullYear()), "task completion date is correct");

    // Mark task as completed
    TaskBoard.TaskModel.complete(orderDinnerTaskId);
    orderDinnerTask = TaskBoard.TaskModel.get(orderDinnerTaskId);
    ok(orderDinnerTask.status == TaskBoard.TaskModel.TASK_STATUS_COMPLETE, "task status is complete");

    // Delete the task
    TaskBoard.TaskModel.delete(orderDinnerTaskId);
    orderDinnerTask = TaskBoard.TaskModel.get(orderDinnerTaskId);
    ok(orderDinnerTask == null, "task is deleted");

});

test('testTaskListing()', function() {
    var todayTask, tmrwTask, thisweekTask, laterTask;
    var todayTaskList, tmrwTaskList, thisweekTaskList, laterTaskList;

    todayTask = TaskBoard.TaskModel.get(TaskBoard.TaskModel.create("Today Task", "Call XXX-XXX-XXXX",
                                                        "homeCategoryId", TaskBoard.TaskModel.TODAY));
    tmrwTask = TaskBoard.TaskModel.get(TaskBoard.TaskModel.create("Tmrw Task", "Call XXX-XXX-XXXX",
                                                        "homeCategoryId", TaskBoard.TaskModel.TOMORROW));
    thisweekTask = TaskBoard.TaskModel.get(TaskBoard.TaskModel.create("This Week Task", "Call XXX-XXX-XXXX",
                                                        "homeCategoryId", TaskBoard.TaskModel.THIS_WEEK));
    laterTask = TaskBoard.TaskModel.get(TaskBoard.TaskModel.create("Later Task", "Call XXX-XXX-XXXX",
                                                        "homeCategoryId", TaskBoard.TaskModel.LATER));

    todayTaskList = TaskBoard.TaskModel.todaysTasks(0);
    ok(todayTaskList.length == 1, "today's task list length is correct");
    ok(todayTaskList[0].title == "Today Task", "today's task list is correct");


    tmrwTaskList = TaskBoard.TaskModel.tomorrowsTasks(0);
    ok(tmrwTaskList.length == 1, "tomorrow's task list length is correct");
    ok(tmrwTaskList[0].title == "Tmrw Task", "tomorrow's task list is correct");

    thisweekTaskList = TaskBoard.TaskModel.thisWeeksTasks(0);
    ok(thisweekTaskList.length == 1, "this weeks 's task list length is correct");
    ok(thisweekTaskList[0].title == "This Week Task", "this week's task list is correct");

    laterTaskList = TaskBoard.TaskModel.laterTasks(0);
    ok(laterTaskList.length == 1, "Later task list length is correct");
    ok(laterTaskList[0].title == "Later Task", "later's task list is correct");


});



