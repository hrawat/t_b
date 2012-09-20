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
            var submitHandler = TaskBoard.view.CreateCategoryForm.submitHandler;
            var categoryName = $("#categoryNameId").val();
            var sharedUsersEmail = $("#sharedUsersEmail").val();
            if (sharedUsersEmail.index('Share task with friends')) {
                sharedUsersEmail = '';
            }
            if (submitHandler) {
               submitHandler(categoryName, sharedUsersEmail);
            }
            return false;
        });
        this.initialized = true;
    },

    setSubmitHandler : function(submitHandler) {
        this.submitHandler = submitHandler;
    },

    display : function(show) {
        var sharedUsersEmailDT = "Share task with friends or family by input their emails: user@email.com, user2@email.com";
        if (show) {
            $("#createCategoryContainer").show().css("display", "block");
            $("#createTaskContainerShadow").show().css("display", "block");
            $("#sharedUsersEmail").val(sharedUsersEmailDT);
            $('#sharedUsersEmail').focus(function() {
                if ($("#sharedUsersEmail").val() == sharedUsersEmailDT) {
                    $("#sharedUsersEmail").val("");
                };
            });
           $('#categoryNameId').val("");
        } else {
            $("#createCategoryContainer").show().css("display", "none");
            $("#createTaskContainerShadow").show().css("display", "none");
        }

    }


}
