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

        // Remove all categories
        $('#createTaskForm .category').remove();

        // add categories to task form
        for (index=0; index < categories.length; index++) {
            var categoryElt = "<li><a id='category_{0}'>{1}<div style='background:#{2}'></div></a></li>".format(
                                        categories[index].id, categories[index].name, categories[index].colorCode);
            $("#addCategoryInTaskForm").before(categoryElt);
        }
    },

    setCreateCategoryActionHandler : function(createCategoryCallBack) {

    }


}
