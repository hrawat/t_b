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
            var taskStatusClass = task['status'] == TaskBoard.TaskModel.TASK_STATUS_COMPLETE ? "completedTask" : "task"
            var taskElt = "<div id='task_{0}' class='pro_pad-shadow item {1}'> \
                                <div class='pro_curved-hz-2'> \
                                    <div class='pro_text-shadow' > \
                                        <div class='block_tag' style='background:#{2}'></div> \
                                            <div class='pro_text-shadow upper_content {3}'> \
                                                {4}   \
                                            <div class='secondOptions'> \
                                                <a class='Botton menuButtons taskDone' href='#'>Done</a>  \
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
        $("#container .task .upper_content").mouseover(function(){
            $(this).children().css("display", "block")
        });

        $("#container .task .upper_content").mouseout(function() {
            $(this).children().css("display", "none")
        });

        $(".taskDone").click(function() {
            var idStr = $(this).parents(".task").attr("id");
            var taskId = idStr.substring("task_".length);
            doneCallBack(taskId);
            return false;
        });

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

        $(".deleteme").click(function() {
            var idStr = $(this).parents(".task").attr("id");
            var taskId = idStr.substring("task_".length);
            deleteCallBack(taskId);
            return false;
        });

    },

    setAddTaskHandler : function(callBack) {
        $("#addTaskId").click(callBack);
    }
}




