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
        $("#localDateId").text(data.localDate);
        $("#localDayId").text(data.localDay);
    }
}




