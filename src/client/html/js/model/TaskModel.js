if (typeof(TaskBoard) == "undefined") {
    TaskBoard = {};
}

TaskBoard.TaskModel = {

    TODAY : "today",
    TOMORROW : "tomorrow",
    THIS_WEEK : "thisWeek",
    LATER : "later",

    TASK_STATUS_ACTIVE : "taskActive",
    TASK_STATUS_COMPLETE : "taskComplete",

    LOW_PRIORITY : 'lowPriority',
    MEDIUM_PRIORITY : 'mediumPriority',
    HIGH_PRIORITY : 'highPriority',

    loadTasksFromServer : function(modifiedSince, successCallBack, failureCallBack) {
        var taskId, task, allTasks ;
        var today = new Date();
        var taskCreationReq = $.ajax({
            url : "task",
            dataType : "json",
            type : "GET",
            async :true,
            data : {
                "reqType" : "userTasks",
                "modifiedSince" : modifiedSince
            }
        });

        taskCreationReq.done(function(result) {
            if (result['success']) {
                this._saveAllTasks(result['payload']);
                successCallBack.call(this, result['payload']);
            } else {
                failureCallBack.call(this, result['errCode'], result['errMsg']);
            }

        });

    },

    create : function(taskParams, successCallBack, failureCallBack) {
        var taskId, task, allTasks ;
        var today = new Date();
        var taskCreationReq = $.ajax({
            url : "task",
            dataType : "json",
            type : "GET",
            async :true,
            data : {
                    "reqType" : "create",
                    "categoryId" : taskParams.categoryId,
                    "title" : taskParams.title,
                    "description" : taskParams.description,
                    "priority" : taskParams.priority,
                    "dueDate" : (this._getDate(today, taskParams.completeBy).getTime())/1000
            }
        });

        taskCreationReq.done(function(result) {
            if (result['success']) {
                successCallBack.call(this, result['payload']);
            } else {
                failureCallBack.call(this, result['errCode'], result['errMsg']);
            }

        });
    },

    save: function(taskId, title, description, categoryId, priority, completeBy) {
        var allTasks, index, today;
        allTasks = this._allTasks();
        index = this._indexOf(taskId);
        today = new Date();
        if (index >= 0) {
            allTasks[index].title = title;
            allTasks[index].description = description;
            allTasks[index].categoryId = categoryId;
            allTasks[index].priority = priority,
            allTasks[index].status =  this.TASK_STATUS_ACTIVE,
            allTasks[index].completeBy = completeBy;
            allTasks[index].completionDate = this._getDate(today, completeBy);

            this._saveAllTasks(allTasks);
        }
    },

    get : function(taskId) {
        var allTasks, index;
        allTasks = this._allTasks();
        index = this._indexOf(taskId);
        if (index >= 0) {
            return allTasks[index];
        } else {
            return null;
        }

    },

    delete: function(taskId) {
        var prevAllTasks, allTasks, index;

        allTasks = new Array();
        prevAllTasks = this._allTasks();
        for (index=0; index < prevAllTasks.length; index++) {
            if (prevAllTasks[index].taskId != taskId) {
                allTasks.push(prevAllTasks[index]);
            }
        }
        this._saveAllTasks(allTasks);


    },

    complete: function(taskId) {
        var allTasks, index;
        allTasks = this._allTasks();
        index = this._indexOf(taskId);
        if (index >= 0) {
            allTasks[index].status = this.TASK_STATUS_COMPLETE;
            allTasks[index].dateTaskCompleted = new Date();
            this._saveAllTasks(allTasks);
        }


    },

    setPriority : function(taskId, priority) {
        var allTasks, index;
        allTasks = this._allTasks();
        index = this._indexOf(taskId);
        if (index >= 0) {
            allTasks[index].priority = this.priority;
            this._saveAllTasks(allTasks);
        }
    },

    todaysTasks: function(categoryId) {
        var today, prevRefDate, refDate;
        today = new Date();

        prevRefDate = null;
        refDate = this._getDate(today, this.TODAY);

        return this._tasksList(categoryId, prevRefDate, refDate);
    },

    tomorrowsTasks: function(categoryId) {
        var today, prevRefDate, refDate;
        today = new Date();

        prevRefDate = this._getDate(today, this.TODAY);
        refDate = this._getDate(today, this.TOMORROW);
        return this._tasksList(categoryId, prevRefDate, refDate);
    },

    thisWeeksTasks: function(categoryId) {
        var today, prevRefDate, refDate;
        today = new Date();

        prevRefDate = this._getDate(today, this.TOMORROW);
        refDate = this._getDate(today, this.THIS_WEEK);
        return this._tasksList(categoryId, prevRefDate, refDate);
    },

    laterTasks: function(categoryId) {
        var today, prevRefDate, refDate;
        today = new Date();

        prevRefDate = this._getDate(today, this.THIS_WEEK);
        refDate = this._getDate(today, this.LATER);
        return this._tasksList(categoryId, prevRefDate, refDate);
    },

    _sameDay : function(date1, date2) {
        if ((date1.getDate() == date2.getDate()) && (date1.getMonth() == date2.getMonth())
                                                && (date1.getFullYear() == date2.getFullYear())) {
            return true;
        } else {
            return false;
        }

    },

    _tasksList : function(categoryId, prevRefDate, refDate) {
        var today, retValue, allTasks, index;
        var now = new Date();


        retValue = new Array();
        allTasks = this._allTasks();
        for (index=0; index < allTasks.length; index++) {
            if ( ((prevRefDate == null) || (allTasks[index].completionDate.getTime() >= refDate.getTime())) &&
                            ((refDate == null) || (allTasks[index].completionDate.getTime() <= refDate.getTime()))) {
                if (allTasks[index].status == this.TASK_STATUS_COMPLETE) {
                    if ((allTasks[index].dateTaskCompleted == undefined) || (this._sameDay(now, allTasks[index].dateTaskCompleted) == false)) {
                        continue;
                    }

                }
                if (categoryId == 0) {
                    retValue.push(allTasks[index]);
                } else if (allTasks[index].categoryId == categoryId) {
                    retValue.push(allTasks[index]);
                }
            }
        }
        return retValue

    },

    // define semantics
    changePosition: function() {

    },

    _indexOf : function(taskId) {
        var allTasks, index;
        allTasks = this._allTasks();
        for (index=0; index < allTasks.length; index++) {
            if (allTasks[index].taskId == taskId) {
                return index;
            }
        }
        return -1;

    },

    _allTasks : function() {
        var allTasksStr, allTasks, index;
        allTasksStr = localStorage.getItem("TaskBoard.tasks");

        if ((allTasksStr == null) || (allTasksStr == "") ) {
            allTasks = Array();
        } else {
            //allTasks = JSON.parse(allTasksStr);
            allTasks = jQuery.parseJSON(allTasksStr);
            for (index=0; index < allTasks.length; index++) {
                allTasks[index].completionDate = new Date(allTasks[index].completionDate);
                allTasks[index].creationDate = new Date(allTasks[index].creationDate);
                if (allTasks[index].dateTaskCompleted != undefined) {
                    allTasks[index].dateTaskCompleted = new Date(allTasks[index].dateTaskCompleted);
                }
            }
        }
        return allTasks;

    },

    _saveAllTasks : function(allTasks) {
        var allTasksStr;
        if (allTasks == null) {
            return;
        } else {
            allTasksStr = JSON.stringify(allTasks);
            localStorage.setItem("TaskBoard.tasks", allTasksStr);
        }
    },

    _getDate : function(today, completeBy) {
        var daysToEndOfWeek;
        if (completeBy == this.TODAY) {
            return new Date(today.getFullYear(), today.getMonth(), today.getDate(), 23, 59, 59, 0);
        } else if (completeBy == this.TOMORROW) {
            return new Date((new Date(today.getFullYear(), today.getMonth(), today.getDate(), 23, 59, 59, 0)) + 1);
        } else if (completeBy == this.THIS_WEEK) {
            // assume friday to be the end of the week
            daysToEndOfWeek = 7 - (today.getDay() % 6);
            return new Date((new Date(today.getFullYear(), today.getMonth(), today.getDate(), 23, 59, 59, 0)) + daysToEndOfWeek);
        } else {
            // some date in future
            return new Date(2020, 12, 31);
        }

    }
}
