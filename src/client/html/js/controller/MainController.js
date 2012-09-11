/**
 * This is the main controller
 */

if (typeof(TaskBoard) == "undefined") {
    TaskBoard = {};
    TaskBoard.view = {};
    TaskBoard.controller = {};
}

TaskBoard.controller.MainController = {
    initialize : function() {
        var userInfo, categories, tasks;

        var renderFunction = function() {
            var leftNavData = {};
            var rightContentData = {};
            if ( (userInfo != undefined) && (categories != undefined) && (tasks != undefined)) {
                TaskBoard.view.Header.render(userInfo);
                leftNavData["localDay"] = getLocalDay();
                leftNavData["localDate"] = getLocalDateSting();
                leftNavData['categories'] = categories;
                TaskBoard.view.LeftNavigation.render(leftNavData);

                rightContentData['todayTasks'] = TaskBoard.TaskModel.todaysTasks(0);
                TaskBoard.view.rightContent.render(rightContentData);

                window.setTimeout(function() {
                    console.log("calling initialize from timer");
                    this.initialize();
                }, 60*1000);
            }
        }

        // Get the user info from server
        TaskBoard.UserModel.getUserInfo(
            function(payload) {
                userInfo = payload;
                renderFunction();
            },
            function(errCode, ErrMsg) {
                alert("Internal error, err code "+errCode+ " errMsg "+errMsg);
            });

        // Get categories
        TaskBoard.CategoryModel.list(function(payload) {
                categories = payload ;
                renderFunction();
            },
            function(errCode, errMsg) {
                alert("gor error from server err code " + errCode + " err msg " + errMsg);

            });

        // Get user tasks
        TaskBoard.TaskModel.loadTasksFromServer(function(payload) {
                tasks = payload ;
                renderFunction();
            },
            function(errCode, errMsg) {
                alert("gor error from server err code " + errCode + " err msg " + errMsg);

            });

    }




}
