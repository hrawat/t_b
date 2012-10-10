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
        var errorFn = function(errCode, errMsg) {
            redirectToLoginPage();
            alert("Error in communicating with server err code: " + errCode + " err msg: "+errMsg);
        };

        var renderHeaderFn = function () {
           var headerData = {};
           headerData['userInfo'] = userInfo;
           headerData['taskStats'] = TaskBoard.TaskModel.stats(userInfo['id']);
           TaskBoard.view.Header.render(headerData);
           TaskBoard.view.Header.setLogoutHandler(function(){
                    TaskBoard.UserModel.logout(function() {
                            redirectToLoginPage();
                    },
                    errorFn);
            });

        };
 
        var renderRightContentFn = function() {
            var rightContentData = {};

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
                                    function(taskId, taskTitle) {
                                        TaskBoard.TaskModel.complete(taskId, 
                                           function() {
                                              successFn();
                                               TaskBoard.view.rightContent.setGlobalStatus("Task '{0}' completed".format(taskTitle));
                                           }, errorFn);

                                    },
                                    function(taskId, taskTitle) {
                                        TaskBoard.TaskModel.delete(taskId, 
                                            function() {
                                               successFn(); 
                                               TaskBoard.view.rightContent.setGlobalStatus("Task '{0}' deleted".format(taskTitle));
                                            } , errorFn);
                                    },
                                    function(taskId, important) {
                                        changePriorityReq = {}  ;
                                        changePriorityReq.taskId = taskId;
                                        changePriorityReq.priority = important ? "highPriority" : "mediumPriority";
                                        TaskBoard.TaskModel.changePriority(changePriorityReq, successFn, errorFn);
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
                                TaskBoard.TaskModel.loadTasksFromServer(function() {
                                                         renderHeaderFn();
                                                         renderFn();
                                                         TaskBoard.view.rightContent.setGlobalStatus("Task '{0}' created".format(createTaskRes.title));
                                                      }, errorFn);
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

                TaskBoard.view.LeftNavigation.setAddCategoryHandler(function() {
                    var createCategoryFormData = {};
                    TaskBoard.view.CreateCategoryForm.render(createCategoryFormData);
                    TaskBoard.view.CreateCategoryForm.setSubmitHandler(
                               function(categoryName, sharedWithUsersEmail) {
                                   var categoryReq = {};
                                   categoryReq.name = categoryName;
                                   categoryReq.sharedWithUsersEmail = sharedWithUsersEmail;

                                   TaskBoard.CategoryModel.create(categoryReq,
                                       function(createCategoryRes) {
                                           TaskBoard.CategoryModel.list(
                                                function(payload) {
                                                    categories = payload;
                                                    renderFunction();
                                                    TaskBoard.view.CreateCategoryForm.display(false);
                                                },
                                               function(errCode, errMsg) {
                                                   alert("error in getting list of categories, err code "+errCode+ " errMsg "+errMsg);
                                               });
                                       },
                                       function(errCode, errMsg) {
                                           alert("error in creating category, err code "+errCode+ " errMsg "+errMsg);
                                       });

                                  // Call model

                               });
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
                // Get categories
                TaskBoard.CategoryModel.list(function(payload) {
                        categories = payload ;
                        renderFunction();
                    },
                    errorFn);

                // Get user tasks
                TaskBoard.TaskModel.loadTasksFromServer(function(payload) {
                        tasks = payload ;
                        renderFunction();
                    },
                    errorFn);
            },
            function(errCode, ErrMsg) {
                alert("Internal error, err code "+errCode+ " errMsg "+errMsg);
            });


    }




}
