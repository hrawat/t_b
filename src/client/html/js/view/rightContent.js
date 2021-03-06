/**
 * This view is responsible for setting the right content area
 */

if (typeof(TaskBoard) == "undefined") {
    TaskBoard = {};
    TaskBoard.view = {};
    TaskBoard.controller = {};
}

TaskBoard.view.rightContent = {
    render : function(data) {
        var thisWeeksTasks = data['thisWeeksTasks'];
        var laterTasks = data['laterTasks'];
        var selectedCategoryId = data['selectedCategoryId'];

        $("#newTaskHintId").remove();
        if (thisWeeksTasks.length == 0) {
           $("#container").append("<div id='newTaskHintId'><img  src='img/arrow.png' align='middle'/>Create a new task here.</div>");
        } 

        $('.task').remove();
        $('.completedTask').remove();
        thisWeeksTasks.forEach(function(task, index) {
            if ( (task['status'] == TaskBoard.TaskModel.TASK_STATUS_ACTIVE) ||
                ((task['status'] == TaskBoard.TaskModel.TASK_STATUS_COMPLETED) && (task['completionDate'] > getStartOfWeekDate()))) {
                var taskElt = TaskBoard.view.rightContent._createTaskElement(task);
                $("#container").append(taskElt);
            }

        });
        var completedTasks = TaskBoard.view.rightContent._getTasksCount(thisWeeksTasks, true);
        var totalTasks = completedTasks + TaskBoard.view.rightContent._getTasksCount(thisWeeksTasks, false);
        var completedPercent = 0;
        if (completedTasks > 0) {
           completedPercent =  ((completedTasks*100)/totalTasks);
        }

        $("#weeklyTaskStatusId").text("{0}/{1}".format(completedTasks, totalTasks));
        
        $("#thisWeekProgressBarId div").css("width", completedPercent + "%");


        //$('#container').masonry( 'reload' );
        var masonryOptions = {
                // options
                //itemSelector : '.item',
                isAnimated: false,
                animationOptions: {
                    duration: 400,
                    easing: 'linear',
                    queue: false
                },
                columnWidth : 320,
                isDraggable: true,
                dragHandleSelector: '.block_tag',
                dragStartCallbackFn : function() {
                   TaskBoard.view.rightContent.draggingActive = true; 
                },
                dragEndCallbackFn : function(draggedElt, beforeElt, afterElt) {
                   TaskBoard.view.rightContent.draggingActive = false;
                   if (TaskBoard.view.rightContent.taskReorderedHandler != undefined) {
                       var taskId = draggedElt.id.substring("task_".length);
                       var beforeTaskId = null;
                       if (beforeElt != null) {
                          beforeTaskId = beforeElt.id.substring("task_".length);
                       }
                       var afterTaskId = null;
                       if (afterElt != null) {
                          afterTaskId = afterElt.id.substring("task_".length);
                       }
                       TaskBoard.view.rightContent.taskReorderedHandler(taskId, beforeTaskId, afterTaskId);
                   }
                   return false;
                },
                dragCallbackFn : function(topPos, leftPos) {
                   var containerTop = $("#container").offset().top;
                   var containerLeft = $("#container").offset().left;
                   var containerBottom = $("#container").height() + containerTop;
                   var containerRight = $("#container").width() + containerLeft;
         
                   if ( (topPos < containerTop) || (topPos > containerBottom) ||
                               (leftPos < containerLeft) || (leftPos > containerRight)) { 
                      //console.log("returning false");
                      // todo: fix this to restrict drag action only within container
                      return true;
                   }
                   return true;
                }
            };
        $('#container').masonry( 'reloadItems' );
        $('#container').masonry(masonryOptions);

        laterTasks.forEach(function(task, index) {
            var taskElt = TaskBoard.view.rightContent._createTaskElement(task);
            $("#laterTasksContainer").append(taskElt);
        });
        $('#laterTasksContainer').masonry( 'reload' );

    },

    _getTasksCount : function(tasks, completedTasks) {

        var tasksCount = 0;
        var index = 0;
        for (index=0; index < tasks.length; index++) {
            if (completedTasks) {
               if ((tasks[index].status == TaskBoard.TaskModel.TASK_STATUS_COMPLETED)
                   && (tasks[index]['completionDate'] > getStartOfWeekDate())) {
                   tasksCount++;
               }
            } else if (tasks[index].status == TaskBoard.TaskModel.TASK_STATUS_ACTIVE) {
                tasksCount++;
            }
        }
        return tasksCount;

    },

    _createTaskElement : function(task) {
        var category = TaskBoard.CategoryModel.get(task['categoryId']);
        var importantClassValue = task['priority'] == TaskBoard.TaskModel.HIGH_PRIORITY ? "important" : "";
        var focussedClassValue = task['priority'] == TaskBoard.TaskModel.HIGH_PRIORITY ? "focused" : "focusStar";
        var createdTimeAgo = getTimeDiffInStr(task.creationDate);
        var taskStatusClass = task['status'] == TaskBoard.TaskModel.TASK_STATUS_COMPLETED ? "completedTask" : "task"
        var taskElt = "<div id='task_{0}' class='pro_pad-shadow item {1}'> \
                                    <div class='pro_curved-hz-2'> \
                                        <div class='pro_text-shadow' > \
                                            <div class='block_tag' style='background:#{2}'></div> \
                                                <div class='pro_text-shadow upper_content {3}'> \
                                                    <p>{4}</p>   \
                                                <div class='secondOptions'> \
                                                    <a class='Botton menuButtons taskDone' href='#'>Done</a>  \
                                                    <a class='Botton menuButtons taskEdit' href='#'>Edit</a>  \
                                                    <div class='delete-alt deleteme'><a href=''#'></a></div> \
                                                </div> \
                                            </div> \
                                            <div class='lower_portion'> \
                                                <img src='{5}' /> \
                                                <div class='details'> \
                                                    <ul> \
                                                        <li>{6}</li>  \
                                                        <li>{7} ago</li>  \
                                                    </ul>                    \
                                                </div> \
                                                <br class='clear:both;' /> \
                                                <a class='{8} tooltip makeImportant' href='#'><span class='classic'>This task is important</span></a> \
                                                \
                                            </div> \
                                        </div> \
                                    </div> \
                                </div>".format(task['id'],
            taskStatusClass,
            category.colorCode,
            importantClassValue,
            task['title'],
            task['createdBy']['userSmallAvatarUrl'],
            category['name'],
            createdTimeAgo,
            focussedClassValue);
        return taskElt;
    },

    setTaskActionHandlers : function(doneCallBack, deleteCallBack, makeImportantCallBack) {
        $(".task .upper_content").unbind("mouseover");
        $(".task .upper_content").mouseover(function(){
            if (TaskBoard.view.rightContent.draggingActive != true) {
               $(this).children(".secondOptions").css("display", "block")
            }
        });

        $(".task .upper_content").unbind("mouseout");
        $(".task .upper_content").mouseout(function() {
            $(this).children(".secondOptions").css("display", "none")
        });

        $(".completedTask .upper_content").unbind("mouseover");
        $(".completedTask .upper_content").mouseover(function(){
            if (TaskBoard.view.rightContent.draggingActive != true) {
               $(this).children().css("display", "block")
               $(this).children(".secondOptions").children(".taskDone").css("display", "none")
               $(this).children(".secondOptions").children(".taskEdit").css("display", "none")
            }
        });

        $(".completedTask .upper_content").unbind("mouseout");
        $(".completedTask .upper_content").mouseout(function() {
            $(this).children(".secondOptions").css("display", "none")
        });

        $(".taskDone").unbind("click");
        $(".taskDone").click(function() {
            var idStr = $(this).parents(".task").attr("id");
            var taskId = idStr.substring("task_".length);
            var taskTitle = $(this).parents(".upper_content").children("p").text();
            doneCallBack(taskId, taskTitle);
            return false;
        });


        $(".makeImportant").unbind("click");
        $(".makeImportant").click(function() {
            var idStr = $(this).parents(".task").attr("id");
            var taskId = idStr.substring("task_".length);
            var important = $(this).hasClass('focused');
            if (important == true) {
                $(this).removeClass('focused');
                $(this).addClass('focusStar');
            } else {
                $(this).addClass('focused');
                $(this).removeClass('focusStar');
            }
            makeImportantCallBack(taskId, !important);
            return false;
        });

        $(".deleteme").unbind("click");
        $(".deleteme").click(function() {
            var idStr = $(this).parents(".task").attr("id");
            if (idStr == undefined) {
               idStr = $(this).parents(".completedTask").attr("id");
            }
            var taskId = idStr.substring("task_".length);
            var taskTitle = $(this).parents(".upper_content").children("p").text();
            deleteCallBack(taskId, taskTitle);
            return false;
        });

    },

    setAddTaskHandler : function(callBack) {
        $("#addTaskId").unbind("click");
        $("#addTaskId").click(function(){
            callBack("", "");
        });
        $("#laterAddTaskId").unbind("click");
        $("#laterAddTaskId").click(function(){
            callBack("", "");
        });
    },

    setEditTaskHandler : function(callBack) {
        $(".taskEdit").unbind("click");
        $(".taskEdit").click(function(){
            var idStr = $(this).parents(".task").attr("id");
            var taskId = idStr.substring("task_".length);
            var taskTitle = $(this).parents(".upper_content").children("p").text();
            callBack(taskId, taskTitle);
        });

    },

    setTaskReorderedHandler : function(callBack) {
        TaskBoard.view.rightContent.taskReorderedHandler = callBack;
    },



    setGlobalStatus: function(statusText) {
        $("#notification").empty();
        $("#notification").append("<span><p>{0}</p></span>".format(statusText));
        $("#notification").css("display", "block");
        TaskBoard.view.rightContent.statusTime = Math.round(new Date().getTime()/1000.0) ;
        window.setTimeout(function() {
            $("#notification").css("display", "none");
        }, 15*1000)
    }
}




