test('testCreate()', function() {
    var taskId;
    taskId = TaskBoard.CategoryModel.create("Home", "home.png", "0xff000000", null);

    ok(taskId != null, 'task id is not null');

})