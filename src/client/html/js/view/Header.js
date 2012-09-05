/**
 * This view is responsible for setting the header
 */

if (typeof(TaskBoard) == "undefined") {
    TaskBoard = {};
    TaskBoard.view = {};
    TaskBoard.controller = {};
}

TaskBoard.view.Header = {
    render : function(data) {
        $("#existingTasksCountId").text(data.existingTasksCount);
        $("#tasksDoneInWeekCountId").text(data.tasksDoneInWeekCount);
        $("#userSmallAvatarUrlId").attr("src", data.userSmallAvatarUrl)
    }
}




