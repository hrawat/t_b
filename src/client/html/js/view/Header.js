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
        $("#existingTasksCountId").text(data.taskStats.existingTasks);
        $("#tasksDoneInWeekCountId").text(data.taskStats.tasksCompletedInWeek);
        $("#userSmallAvatarUrlId").attr("src", data.userInfo.userSmallAvatarUrl)
    },

    setLogoutHandler : function(callBack) {
        $('#logoutAction').unbind("click");
        $('#logoutAction').click(callBack);
    }
}




