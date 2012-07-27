
test('testGetDate()', function() {
    var refDate, today, tomorrow, thisWeek, later;
    refDate = new Date(2012, 7, 26, 10, 55, 30, 10);
    today = TaskBoard.TaskModel._getDate(refDate, TaskBoard.TaskModel.TODAY);
    tomorrow = TaskBoard.TaskModel._getDate(refDate, TaskBoard.TaskModel.TOMORROW);
    thisWeek = TaskBoard.TaskModel._getDate(refDate, TaskBoard.TaskModel.THIS_WEEK);
    later = TaskBoard.TaskModel._getDate(refDate, TaskBoard.TaskModel.LATER);

    ok((today.getDate() == 26) && (today.getMonth() == 7) && (today.getFullYear() == 2012), "today's calculation is correct");


});
