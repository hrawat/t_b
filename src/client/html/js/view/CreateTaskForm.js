/**
 * This page is responsible for create task form view
 */
if (typeof(TaskBoard) == "undefined") {
    TaskBoard = {};
    TaskBoard.view = {};
    TaskBoard.controller = {};
}

TaskBoard.view.CreateTaskForm = {
    render : function(data) {
        var categories = data['categories'];
        var selectedCategoryId = data['selectedCategoryId'];
        var taskId = (data['taskId'] == undefined) ? "" : data['taskId'];
        var taskTitle = (data['taskTitle'] == undefined) ? "" : data['taskTitle'];
        var index = 0;
        var displayFn = this.display;
        var completeBy = data['completeBy'];
        if (completeBy == undefined) {
           completeBy = TaskBoard.TaskModel.TODAY;
        }



        if (selectedCategoryId == 0) {
           selectedCategoryId = categories[0].id;
        }

        // Remove all categories
        $('#createTaskForm .category').remove();

        // add categories to task form
        for (index=0; index < categories.length; index++) {
            var categoryElt = "<li class='category'><a id='createTFCategory_{0}'>{1}<div style='background:#{2}'></div></a></li>".format(
                                        categories[index].id, categories[index].name, categories[index].colorCode);
            //$("#addCategoryInTaskForm").before(categoryElt);
            $("#categoriesInTaskForm").append(categoryElt);
            if (selectedCategoryId == categories[index].id) {
               $("#createTFCategory_"+selectedCategoryId).addClass("selected");
            }
        }

        // Set the approproiate when

        $("#whenId .selected").removeClass("selected");
        if (completeBy == TaskBoard.TaskModel.LATER) {
            $("#laterId").addClass("selected");
        } else {
            $("#soonId").addClass("selected");
        }


        if (taskId == "") {
            $("#submitCreateTaskId").attr("value", "Create");
        } else {
            $("#submitCreateTaskId").attr("value", "Save");
        }

        if (taskTitle == "") {
            $("#taskTitle").val("What is your task?");
        } else {
            $("#taskTitle").val(taskTitle);
        }


        displayFn(true);
        $("#submitCreateTaskId").unbind("click");
        // todo: figure out better way to pass taskId
        $("#submitCreateTaskId").click(function() {
            var submitHandler = TaskBoard.view.CreateTaskForm.submitHandler;
            var taskTitle = $("#taskTitle").val();
            var categoryId = $("#categoriesInTaskForm a.selected").attr("id").substr("createTFCategory_".length);
            var completeBy = ( $("#whenId a.selected").attr("id") == "soonId") ? TaskBoard.TaskModel.TODAY : TaskBoard.TaskModel.LATER;
            if (submitHandler) {
               submitHandler(taskId, taskTitle, categoryId, completeBy);
            }
            return false;
        });
        


        // Set the click handler for selecting a category
        $("#categoriesInTaskForm li a").click(function() {
           $("#categoriesInTaskForm .selected").removeClass("selected");
           $(this).addClass("selected");
        });

        if (this.initialized) {
            return ;
        }


        // Set the click handler for selecting a category
        $("#whenId li a").click(function() {
            $("#whenId .selected").removeClass("selected");
            $(this).addClass("selected");
        });



        // Set click handler for shadow
        $("#createTaskContainerShadow").click(function() {
            displayFn(false);
            return false;
        });
        // Set click handler for submit button
        $("#cancelCreateTaskId").click(function() {
            displayFn(false);
            return false;
        });

        this.initialized = true;
    },

    setSubmitHandler : function(submitHandler) {
       this.submitHandler = submitHandler;
    },

    display : function(show) {
       if (show) {
            $("#createTaskContainer").show().css("display", "block");
            $("#createTaskContainerShadow").show().css("display", "block");

            $('#taskTitle').focus(function() {
                if ($("#taskTitle").val() == 'What is your task?') {
                    $("#taskTitle").val("");
                };
            });
       } else {
            $("#createTaskContainer").show().css("display", "none");
            $("#createTaskContainerShadow").show().css("display", "none");
       }

    }


}
