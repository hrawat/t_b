/**
 * This page is responsible for create category form view
 */
if (typeof(TaskBoard) == "undefined") {
    TaskBoard = {};
    TaskBoard.view = {};
    TaskBoard.controller = {};
}

TaskBoard.view.CreateCategoryForm = {
    render : function(data) {
        var displayFn = this.display;

        displayFn(true);


        if (this.initialized) {
            return ;
        }

        // Set click handler for shadow
        $("#createTaskContainerShadow").click(function() {
            displayFn(false);
            return false;
        });

        // Set click handler for submit button
        $("#cancelCreateCategory").click(function() {
            displayFn(false);
            return false;
        });

        $("#submitCreateCategory").click(function() {
            alert("submit called");
            return false;
        });
        this.initialized = true;
    },

    setSubmitHandler : function(submitHandler) {
        this.submitHandler = submitHandler;
    },

    display : function(show) {
        if (show) {
            $("#createCategoryContainer").show().css("display", "block");
            $("#createTaskContainerShadow").show().css("display", "block");
        } else {
            $("#createCategoryContainer").show().css("display", "none");
            $("#createTaskContainerShadow").show().css("display", "none");
        }

    }


}
