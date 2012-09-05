if (typeof(TaskBoard) == "undefined") {
    TaskBoard = {};
    TaskBoard.view = {};
    TaskBoard.controller = {};
}

TaskBoard.UserModel = {
    getUserInfo :function(successCallback, failureCallback) {
        var userInfoReq = $.ajax({
            url : "userInfo",
            dataType : "json",
            type : "GET"
        });
        userTasksReq.done(function(result) {
            if (result['success']) {
                successCallBack.call(this, result['payload']);
            } else {
                failureCallBack.call(this, result['errCode'], result['errMsg']);
            }

        });

    }

}


