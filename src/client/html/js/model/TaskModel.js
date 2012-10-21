if (typeof(TaskBoard) == "undefined") {
    TaskBoard = {};
    TaskBoard.view = {};
    TaskBoard.controller = {};
}

TaskBoard.TaskModel = {

    TODAY : "today",
    TOMORROW : "tomorrow",
    THIS_WEEK : "thisWeek",
    LATER : "later",

    TASK_STATUS_ACTIVE : "taskActive",
    TASK_STATUS_COMPLETED : "taskCompleted",

    LOW_PRIORITY : 'lowPriority',
    MEDIUM_PRIORITY : 'mediumPriority',
    HIGH_PRIORITY : 'highPriority',

    loadTasksFromServer : function(successCallBack, failureCallBack) {
        var taskId, task, allTasks ;
        var today = new Date();
//        var modifiedSince = sessionStorage.getItem("TaskBoard.tasks.lastModificationTimestamp");
 //       if (modifiedSince == undefined) {
  //         modifiedSince = 0;
   //     }
        var modifiedSince = 0;
        var userTasksReq = $.ajax({
            url : "task",
            dataType : "json",
            type : "GET",
            async :true,
            data : {
                "reqType" : "userTasks",
                "modifiedSince" : modifiedSince
            },
            context : this
        });

        userTasksReq.done(function(result) {
            if (result['success']) {
                this._saveAllTasks(result['payload'], result['currTimestamp']);
                successCallBack.call(this, this.todaysTasks(0));
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
                    "taskId" : (taskParams.taskId == undefined) ? "" : taskParams.taskId,
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
            allTasks[index].dueDate = this._getDate(today, completeBy);

            this._saveAllTasks(allTasks, 0);
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

    reorderTasks : function(categoryId, taskIds, successCallBack, failureCallBack) {
        var taskIdsStr = taskIds.join(",");
        // todo: handle category Id != 0 scenario
        if (categoryId != 0) {
            return;
        }
        var reorderTasksReq = $.ajax({
            url : "task",
            dataType : "json",
            type : "GET",
            async :true,
            data : {
                "reqType" : "saveTasksOrder",
                "taskIds" : taskIdsStr
            }

        });
        reorderTasksReq.done(function(result) {
            if (result['success']) {
                successCallBack.call(this, result['payload']);
            } else {
                failureCallBack.call(this, result['errCode'], result['errMsg']);
            }

        });
    },

    changePriority: function(taskParams, successCallBack, failureCallBack) {

        var taskChangePriorityReq = $.ajax({
            url : "task",
            dataType : "json",
            type : "GET",
            async :true,
            data : {
                "reqType" : "changePriority",
                "taskId" : taskParams.taskId,
                "priority" : taskParams.priority
            }
        });
        taskChangePriorityReq.done(function(result) {
            if (result['success']) {
                successCallBack.call(this, result['payload']);
            } else {
                failureCallBack.call(this, result['errCode'], result['errMsg']);
            }

        });
    },

    delete: function(taskId, successCallBack, failureCallBack) {

        var taskDeleteReq = $.ajax({
            url : "task",
            dataType : "json",
            type : "GET",
            async :true,
            data : {
                "reqType" : "delete",
                "taskId" : taskId
            }
        });
        taskDeleteReq.done(function(result) {
            if (result['success']) {
                successCallBack.call(this, result['payload']);
            } else {
                failureCallBack.call(this, result['errCode'], result['errMsg']);
            }

        });
    },

    complete: function(taskId, successCallBack, failureCallBack) {
        var taskCompleteReq = $.ajax({
            url : "task",
            dataType : "json",
            type : "GET",
            async :true,
            data : {
                "reqType" : "complete",
                "taskId" : taskId
            }
        });
        taskCompleteReq.done(function(result) {
            if (result['success']) {
                successCallBack.call(this, result['payload']);
            } else {
                failureCallBack.call(this, result['errCode'], result['errMsg']);
            }

        });


    },

    setPriority : function(taskId, priority) {
        var allTasks, index;
        allTasks = this._allTasks();
        index = this._indexOf(taskId);
        if (index >= 0) {
            allTasks[index].priority = this.priority;
            this._saveAllTasks(allTasks, 0);
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

        //prevRefDate = this._getDate(today, this.TOMORROW);
        // get all tasks for which dueDate is less than end of week
        prevRefDate = null;
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
            if (allTasks[index].deleted) {
                continue;
            }
            if ( ((prevRefDate == null) || (allTasks[index].dueDate.getTime() >= refDate.getTime())) &&
                            ((refDate == null) || (allTasks[index].dueDate.getTime() <= refDate.getTime()))) {
//                if (allTasks[index].status == this.TASK_STATUS_COMPLETED) {
//                    if ((allTasks[index].completionDate == undefined) || (this._sameDay(now, allTasks[index].completionDate) == false)) {
//                        continue;
//                    }
//
//                }
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

    stats : function(userId) {

        var currDate = new Date();
        var first = currDate.getDate() - currDate.getDay(); // First day is the day of the month - the day of the week
        var startOfWeekDate = (new Date()).setDate(first);
        var endOfWeekDate = (new Date()).setDate(first+6);

        var allTasks = this._allTasks();

        var index = 0;

        var retValue = {};
        retValue['existingTasks'] = 0;
        retValue['tasksCompletedInWeek'] = 0;
        retValue['remainingTasksOfWeek'] = 0;
        for (index=0; index < allTasks.length; index++) {
            var task = allTasks[index];
            if (task['status'] == this.TASK_STATUS_COMPLETED) {
                if ( (task['completionDate'] >= startOfWeekDate) && (task['completionDate'] <= endOfWeekDate)) {
                    if (task['completedBy'] == userId) {
                       retValue['tasksCompletedInWeek']++;
                    }
                }
            } else {
                retValue['existingTasks']++;
                if (task['dueDate'] <= endOfWeekDate) {
                    retValue['remainingTasksOfWeek']++;
                }
            }
        }
        return retValue;
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
        allTasksStr = sessionStorage.getItem("TaskBoard.tasks");

        if ((allTasksStr == null) || (allTasksStr == "") ) {
            allTasks = Array();
        } else {
            //allTasks = JSON.parse(allTasksStr);
            allTasks = jQuery.parseJSON(allTasksStr);
            for (index=0; index < allTasks.length; index++) {
                allTasks[index].dueDate = new Date(allTasks[index].dueDate*1000);
                allTasks[index].creationDate = new Date(allTasks[index].creationDate*1000);
                if (allTasks[index].completionDate != undefined) {
                    allTasks[index].completionDate = new Date(allTasks[index].completionDate*1000);
                }
            }
        }
        return allTasks;

    },

    _saveAllTasks : function(allTasks, lastModificationTimestamp) {
        var allTasksStr;
        sessionStorage.setItem("TaskBoard.tasks.lastModificationTimestamp", lastModificationTimestamp);
        if (allTasks == null) {
            return;
        } else {
            allTasksStr = JSON.stringify(allTasks);
            sessionStorage.setItem("TaskBoard.tasks", allTasksStr);
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
