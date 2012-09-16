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

        var renderHeaderFn = function () {
           var headerData = {};
           headerData['userInfo'] = userInfo;
           headerData['taskStats'] = TaskBoard.TaskModel.stats();
           TaskBoard.view.Header.render(headerData);

        };
 
        var renderRightContentFn = function() {
            var rightContentData = {};
            var errorFn = function(errCode, errMsg) {
              alert("Error in communicating with server err code: " + errCode + " err msg: "+errMsg);
            };
            var renderFn = arguments.callee;
            var successFn = function() {
               TaskBoard.TaskModel.loadTasksFromServer(function() {
                                                         renderHeaderFn();
                                                         renderFn();
                                                      }, errorFn);
            };
            selectedCategoryId = TaskBoard.view.LeftNavigation.getSelectedCategoryId();
            rightContentData['todayTasks'] = TaskBoard.TaskModel.todaysTasks(selectedCategoryId);
            rightContentData['selectedCategoryId'] = selectedCategoryId;
            TaskBoard.view.rightContent.render(rightContentData);
            TaskBoard.view.rightContent.setTaskActionHandlers(
                                    function(taskId) {
                                        TaskBoard.TaskModel.complete(taskId, successFn, errorFn);

                                    },
                                    function(taskId) {
                                        TaskBoard.TaskModel.delete(taskId, successFn, errorFn);
                                    },
                                    function(taskId, important) {
                                        //todo: hook to server
                                        console.log("changing priority of task "+taskId+" to "+important);
                                    });
            TaskBoard.view.rightContent.setAddTaskHandler(function() {
                // launch create task
                var createTaskFormData = {};
                createTaskFormData.categories = categories;
                createTaskFormData.selectedCategoryId = TaskBoard.view.LeftNavigation.getSelectedCategoryId();
                TaskBoard.view.CreateTaskForm.render(createTaskFormData);
                TaskBoard.view.CreateTaskForm.setSubmitHandler(function(taskTitle, categoryId) {
                   var taskReq = {};
                   taskReq.title = taskTitle;
                   taskReq.description = '';

                   taskReq.categoryId = categoryId;
                   taskReq.priority = TaskBoard.TaskModel.MEDIUM_PRIORITY;
                   taskReq.completeBy = TaskBoard.TaskModel.TODAY;

                   TaskBoard.TaskModel.create(taskReq,
                            function(createTaskRes) {
                               TaskBoard.view.CreateTaskForm.display(false);
                            },
                            function(errCode, errMsg) {
                                alert("error in creating task, err code "+errCode+ " errMsg "+errMsg);
                            });


            return false;

                });

            });

        }

        var renderFunction = function() {
            var selectedCategoryId;
            var leftNavData = {};
            if ( (userInfo != undefined) && (categories != undefined) && (tasks != undefined)) {

                renderHeaderFn();

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
