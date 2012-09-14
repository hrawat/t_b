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
        todayTasks.forEach(function(task, index) {
            var category = TaskBoard.CategoryModel.get(task['categoryId']);
            var importantClassValue = task['priority'] == TaskBoard.TaskModel.HIGH_PRIORITY ? "important" : "";
            var focussedClassValue =  task['priority'] == TaskBoard.TaskModel.HIGH_PRIORITY ? "focused" : "";
            var createdTimeAgo = getTimeDiffInStr(task.creationDate);
            var taskElt = "<div id='task_{0}' class='pro_pad-shadow item task'> \
                                <div class='pro_curved-hz-2'> \
                                    <div class='pro_text-shadow' > \
                                        <div class='block_tag' style='background:#{1}'></div> \
                                            <div class='pro_text-shadow upper_content {2}'> \
                                                {3}   \
                                            <div class='secondOptions'> \
                                                <a class='Botton menuButtons taskDone' href='#'>Done</a>  \
                                                <div class='delete-alt deleteme'><a href=''#'></a></div> \
                                            </div> \
                                        </div> \
                                        <div class='lower_portion'> \
                                            <img src='{4}' /> \
                                            <div class='details'> \
                                                <ul> \
                                                    <li>{5}</li>  \
                                                    <li>{6} ago</li>  \
                                                </ul>                    \
                                            </div> \
                                            <br class='clear:both;' /> \
                                            <a class='{7} tooltip makeImportant' href='#'><span class='classic'>This task is important</span></a> \
                                            \
                                        </div> \
                                    </div> \
                                </div> \
                            </div>".format(task['id'],
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
        $("#container .upper_content").mouseover(function(){
            $(this).children().css("display", "block")
        });

        $("#container .upper_content").mouseout(function() {
            $(this).children().css("display", "none")
        });

        $(".taskDone").click(function() {
            var idStr = $(this).parents(".task").attr("id");
            var taskId = idStr.substring("task_".length);
            $(this).removeClass('task');
            $(this).addClass('.taskDone');
            doneCallBack(taskId);
            return false;
        });

        $(".makeImportant").click(function() {
            var idStr = $(this).parents(".task").attr("id");
            var taskId = idStr.substring("task_".length);
            var important = $(this).hasClass('focused');
            if (important == true) {
                $(this).removeClass('focused');
            } else {
                $(this).addClass('focused');
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

    }
}




