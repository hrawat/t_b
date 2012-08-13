if (typeof(TaskBoard) == "undefined") {
    TaskBoard = {};
}

TaskBoard.UserModel = function() {

    var fbUserUid, userLoggedIn, retValue, initialized;
    var initCallBacks = new Array();

    // Implement singleton pattern : check if an instance already exists
    if (TaskBoard.UserModel.singletonInstance != undefined) {
        return TaskBoard.UserModel.singletonInstance;
    }

    function _initialize() {
        if ($("#fb-root").length == 0) {
            $("body").prepend("<div id='fb-root'");
        }

        // Initialize SDK
        window.fbAsyncInit = function() {
            FB.init({
                appId      : '420637114648782', // App ID
                channelUrl : 'http://ec2-107-20-25-51.compute-1.amazonaws.com/channel.html', // Channel File
                status     : true, // check login status
                cookie     : true, // enable cookies to allow the server to access the session
                xfbml      : true  // parse XFBML
            });

            FB.getLoginStatus( function(response) {
                TaskBoard.User._fbAPIInitialized = true;
                TaskBoard.User._fbAPIInitializing = false;
                if (response.status == 'connected') {
                    TaskBoard.User._fbAPIInitialized = true;
                    fbUserUid = response.authResponse.userId;
                    userLoggedIn = true;
                } else {
                    userLoggedIn = false;
                }
            });

            for(var index=0; index < initCallBacks.length; index++) {
                initCallBacks[index].apply(retValue);
            }

        };

    }

    _initialize();


    retValue = function() {

        function addInitializationCallBack(callBackFunction) {
            if (initialized) {
                callBackFunction.apply(this);
            } else {
                initCallBacks.push(callBackFunction);
            }
        }

        function isUserLoggedIn() {
            return fbUserUid;
        }

        function isUserLoggedIn() {
            return userLoggedIn;
        }

    }

    TaskBoard.UserModel.singletonInstance = retValue;
    return retValue;

};


