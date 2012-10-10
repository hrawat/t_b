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
        var todayTasks = data['todayTasks'];
        var selectedCategoryId = data['selectedCategoryId'];
        $('#container .task').remove();
        $('#container .completedTask').remove();
        todayTasks.forEach(function(task, index) {
            var category = TaskBoard.CategoryModel.get(task['categoryId']);
            var importantClassValue = task['priority'] == TaskBoard.TaskModel.HIGH_PRIORITY ? "important" : "";
            var focussedClassValue =  task['priority'] == TaskBoard.TaskModel.HIGH_PRIORITY ? "focused" : "focusStar";
            var createdTimeAgo = getTimeDiffInStr(task.creationDate);
            var taskStatusClass = task['status'] == TaskBoard.TaskModel.TASK_STATUS_COMPLETED ? "completedTask" : "task"
            var taskElt = "<div id='task_{0}' class='pro_pad-shadow item {1}'> \
                                <div class='pro_curved-hz-2'> \
                                    <div class='pro_text-shadow' > \
                                        <div class='block_tag' style='background:#{2}'></div> \
                                            <div class='pro_text-shadow upper_content {3}'> \
                                                <p>{4}</p>   \
                                            <div class='secondOptions'> \
                                                <div class='doneAction' ><a class='Botton menuButtons taskDone' href='#'>Done</a></div>  \
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
            $("#container").append(taskElt);


        });

        $('#container').masonry( 'reload' );

    },

    setTaskActionHandlers : function(doneCallBack, deleteCallBack, makeImportantCallBack) {
        $("#container .task .upper_content").unbind("mouseover");
        $("#container .task .upper_content").mouseover(function(){
            $(this).children(".secondOptions").css("display", "block")
        });

        $("#container .task .upper_content").unbind("mouseout");
        $("#container .task .upper_content").mouseout(function() {
            $(this).children(".secondOptions").css("display", "none")
        });

        $("#container .completedTask .upper_content").unbind("mouseover");
        $("#container .completedTask .upper_content").mouseover(function(){
            $(this).children().css("display", "block")
            $(this).children(".secondOptions").children(".doneAction").css("display", "none")
        });

        $("#container .completedTask .upper_content").unbind("mouseout");
        $("#container .completedTask .upper_content").mouseout(function() {
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
        $("#addTaskId").click(callBack);
    },

    setGlobalStatus: function(statusText) {
        $("#globalStatus").empty();
        $("#globalStatus").append("<p>{0}</p>".format(statusText));
        $("#globalStatus").css("display", "block");
        TaskBoard.view.rightContent.statusTime = Math.round(new Date().getTime()/1000.0) ;
        window.setTimeout(function() {
            $("#globalStatus").css("display", "none");
        }, 15*1000)
    }
}




