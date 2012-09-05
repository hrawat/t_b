if (typeof(TaskBoard) == "undefined") {
    TaskBoard = {};
}

TaskBoard.UserModel = function() {

    var fbUserUid, userLoggedIn, retValue, initialized =false;
    var initCallBacks = new Array();

    // Implement singleton pattern : check if an instance already exists
    if (TaskBoard.UserModel.singletonInstance != undefined) {
        return TaskBoard.UserModel.singletonInstance;
    }

    function _initialize() {
        if ($("#fb-root").length == 0) {
            $("body").prepend("<div id='fb-root' />");
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
                TaskBoard.UserModel._fbAPIInitialized = true;
                TaskBoard.UserModel._fbAPIInitializing = false;
                if (response.status == 'connected') {
                    fbUserUid = response.authResponse.userID;
                    userLoggedIn = true;
                } else {
                    userLoggedIn = false;
                }
                for(var index=0; index < initCallBacks.length; index++) {
                   initCallBacks[index].apply(retValue);
                }
                initialized = true;
            });


        };

        // Load the SDK Asynchronously
        (function(d){
            var js, id = 'facebook-jssdk', ref = d.getElementsByTagName('script')[0];
            if (d.getElementById(id)) {return;}
            js = d.createElement('script'); js.id = id; js.async = true;
            js.src = "http://connect.facebook.net/en_US/all.js";
            ref.parentNode.insertBefore(js, ref);
        }(document));

    }

    _initialize();


    retValue = new (function() {

        this.addInitializationCallBack = function(callBackFunction) {
            if (initialized) {
                callBackFunction.apply(this);
            } else {
                initCallBacks.push(callBackFunction);
            }
        }

        this.getUserId = function() {
            return fbUserUid;
        }

        this.isUserLoggedIn = function() {
            return userLoggedIn;
        }

    });

    TaskBoard.UserModel.singletonInstance = retValue;
    return retValue;

};


