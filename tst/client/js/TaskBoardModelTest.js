function setUp() {
    localStorage.clear();
};

QUnit.testStart(setUp);

test('testCategoryModel()', function() {
    var homeCategoryId, workCategoryId, categories;

    // Create home category
    homeCategoryId = TaskBoard.CategoryModel.create("Home", "home.png", "0xff000000", null);
    ok(homeCategoryId != null, 'category id is not null');

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



