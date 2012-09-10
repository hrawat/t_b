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
        todayTasks.forEach(function(task, index) {
            var category = TaskBoard.CategoryModel.get(task['categoryId']);
            var importantClassValue = task['priority'] == TaskBoard.TaskModel.HIGH_PRIORITY ? "important" : "";
            var taskElt = "<div class='pro_pad-shadow item'> \
                                <div class='pro_curved-hz-2'> \
                                    <div class='pro_text-shadow' > \
                                        <div class='block_tag' style='background:#{0}'></div> \
                                            <div class='pro_text-shadow upper_content {1}'> \
                                                {2}   \
                                            <div class='secondOptions annie'> \
                                                <a class='Botton menuButtons' href='#'>Done</a>  \
                                                <div class='delete-alt deleteme'><a href=''#'></a></div> \
                                            </div> \
                                        </div> \
                                        <div class='lower_portion'> \
                                            <img src='{3}' /> \
                                            <div class='details'> \
                                                <ul> \
                                                    <li>{4}</li>  \
                                                    <li>2 mins ago</li>  \
                                                </ul>                    \
                                            </div> \
                                            <br class='clear:both;' /> \
                                            <a class='focused tooltip' href='#'><span class='classic'>This task is important</span></a> \
                                        </div> \
                                    </div> \
                                </div> \
                            </div>".format(category.colorCode,
                                                importantClassValue,
                                                task['title'],
                                                task['createdBy']['userSmallAvatarUrl'],
                                                category['name']);
            $("#container").append(taskElt);


        });

    }
}




