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
        var initializeFn = arguments.callee;
        var renderRightContentFn = function() {
            var rightContentData = {};
            selectedCategoryId = TaskBoard.view.LeftNavigation.getSelectedCategoryId();
            rightContentData['todayTasks'] = TaskBoard.TaskModel.todaysTasks(selectedCategoryId);
            rightContentData['selectedCategoryId'] = selectedCategoryId;
            TaskBoard.view.rightContent.render(rightContentData);
            TaskBoard.view.rightContent.setTaskActionHandlers(
                                    function() {

                                    },
                                    function() {

                                    },
                                    function() {

                                    });

        }

        var renderFunction = function() {
            var selectedCategoryId;
            var leftNavData = {};
            if ( (userInfo != undefined) && (categories != undefined) && (tasks != undefined)) {
                TaskBoard.view.Header.render(userInfo);
                leftNavData["localDay"] = getLocalDay();
                leftNavData["localDate"] = getLocalDateSting();
                leftNavData['categories'] = categories;
                TaskBoard.view.LeftNavigation.render(leftNavData);

                renderRightContentFn();


                // Set event handlers
                TaskBoard.view.LeftNavigation.setCategoryClickFnHandler(function() {
                    var idStr = $(this).attr("id");
                    var selectedCategoryId =  idStr.substring("category_".length);
                    TaskBoard.view.LeftNavigation.setSelectedCategoryId(selectedCategoryId);
                    renderRightContentFn();
                });

                window.setTimeout(function() {
                    console.log("calling initialize from timer");
                    initializeFn();
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
