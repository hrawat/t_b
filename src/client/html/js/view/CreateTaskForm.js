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
        var index = 0;
        var displayFn = this.display;

        if (selectedCategoryId == 0) {
           selectedCategoryId = categories[0].id;
        }

        // Remove all categories
        $('#createTaskForm .category').remove();

        // add categories to task form
        for (index=0; index < categories.length; index++) {
            var categoryElt = "<li class='category'><a id='createTFCategory_{0}'>{1}<div style='background:#{2}'></div></a></li>".format(
                                        categories[index].id, categories[index].name, categories[index].colorCode);
            $("#addCategoryInTaskForm").before(categoryElt);
            if (selectedCategoryId == categories[index].id) {
               $("#createTFCategory_"+selectedCategoryId).addClass("selected");
            }
        }
        displayFn(true);
        

        // Set the click handler for selecting a category
        $("#createTaskForm li a").click(function() {
           $("#createTaskForm .selected").removeClass("selected");
           $(this).addClass("selected");
        });

        if (this.initialized) {
           return ;
        }

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

        $("#submitCreateTaskId").click(function() {
            var submitHandler = TaskBoard.view.CreateTaskForm.submitHandler;
            var taskTitle = $("#taskTitle").val();
            var categoryId = $("#createTaskForm a.selected").attr("id").substr("createTFCategory_".length);
            if (submitHandler) {
               submitHandler(taskTitle, categoryId);
            }
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
            $("#taskTitle").val("What is your task?");
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
