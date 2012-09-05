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
        userInfoReq.done(function(result) {
            if (result['success']) {
                successCallback.call(this, result['payload']);
            } else {
                failureCallback.call(this, result['errCode'], result['errMsg']);
            }

        });

    }

}


