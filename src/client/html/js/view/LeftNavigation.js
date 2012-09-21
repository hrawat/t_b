/**
 * This view is responsible for setting the left navigation
 */

if (typeof(TaskBoard) == "undefined") {
    TaskBoard = {};
    TaskBoard.view = {};
    TaskBoard.controller = {};
}

TaskBoard.view.LeftNavigation = {
    render : function(data) {
        var categories = data['categories'];
        var index = 0;

        $("#localDateId").text(data.localDate);
        $("#localDayId").text(data.localDay);
        
        $selectedCategoryId = TaskBoard.view.LeftNavigation.getSelectedCategoryId();

        $('#categoriesList .category').remove();
        for(index=0; index < categories.length; index++) {
            var categoryElt = "<li class='category' ><a id='category_{0}' class='calendar'>{1}<div style='background:#{2}'></div></a></li>".format(categories[index].id, categories[index].name, categories[index].colorCode);
            $("#addCategoryId").before(categoryElt);
        }
        TaskBoard.view.LeftNavigation.setSelectedCategoryId($selectedCategoryId);
    },

    getSelectedCategoryId : function() {
        var idStr = $('#categoriesList .selected').attr("id");
        if ((idStr == undefined) || (idStr == null)) {
           return "0";
        } else {
           return idStr.substring("category_".length);
        }
    },

    setSelectedCategoryId : function(categoryId) {
        $('#categoriesList .selected').removeClass('selected');
        $('#category_'+categoryId).addClass('selected');

    },

    setCategoryClickFnHandler : function(callBackFn) {
        $('#categoriesList li.category a').unbind("click");
        $('#categoriesList li.category a').click(callBackFn);

        $('#category_0').unbind("click");
        $('#category_0').click(callBackFn);
    },

    setAddCategoryHandler : function(callBack) {
        $("#addCategoryId").unbind("click");
        $("#addCategoryId").click(callBack);
    }
}




