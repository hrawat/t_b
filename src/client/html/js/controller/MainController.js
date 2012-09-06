/**
 * This is the main controller
 */

if (typeof(TaskBoard) == "undefined") {
    TaskBoard = {};
    TaskBoard.view = {};
    TaskBoard.controller = {};
}

TaskBoard.controller.MainController = {
    initialize : function() {
        var userInfo, categories;

        var renderFunction = function() {
            if ( (userInfo != undefined) && (categories != undefined)) {
                TaskBoard.view.Header.render(userInfo);
                categories["localDate"] = getLocalDateSting();
                TaskBoard.view.LeftNavigation.render(categories);
            }
        }

        // Get the user info from server
        TaskBoard.UserModel.getUserInfo(
            function(payload) {
                userInfo = payload;
                renderFunction();
            },
            function(errCode, ErrMsg) {
                alert("Internal error, err code "+errCode+ " errMsg "+errMsg);
            });

        // Get categories
        TaskBoard.CategoryModel.list(function(payload) {
                categories = payload ;
                renderFunction();
            },
            function(errCode, errMsg) {
                alert("gor error from server err code " + errCode + " err msg " + errMsg);

            });
    }


}
