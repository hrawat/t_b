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

        $('#categoriesList .category').remove();
        for(index=0; index < categories.length; index++) {
            var categoryElt = "<li class='category' ><a id='category_{0}' class='calendar'>{1}<div style='background:#{2}'></div></a></li>".format(categories[index].id, categories[index].name, categories[index].colorCode);
            $("#addCategoryId").before(categoryElt);
        }

    }
}




