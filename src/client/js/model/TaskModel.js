if (typeof(TaskBoard) == "undefined") {
    TaskBoard = {};
}

TaskBoard.TaskModel = {

    TODAY : "today",
    TOMORROW : "tomorrow",
    THIS_WEEK : "thisWeek",
    LATER : "later",

    create : function(title, description, categoryId, completeBy) {
        var taskId, task, allTasks;

        taskId = createUUID();
        task = {
            "taskId" : categoryId,
            "creationDate" : new Date(),
            "title" : title,
            "description" : description,
            "categoryId" : categoryId,
            "completeBy" : completeBy
        };
        allTasks = this._allCategories();
        allTasks.push(task);
        this._saveAllTasks(allTasks);
        return taskId;

    },

    save: function(taskId, title, description, categoryId, competeBy) {

    },

    delete: function(taskId) {

    },

    complete: function(taskId) {

    },

    todaysTasks: function(categoryId) {

    },

    tomorrowsTasks: function(categoryId) {

    },

    thisWeeksTasks: function(categoryId) {

    },

    laterTasks: function(categoryId) {

    },

    // define semantics
    changePosition: function() {

    },

    _allTasks : function() {
        var allTasksStr, allTasks;
        allTasksStr = localStorage.getItem("TaskBoard.tasks");

        if ((allTasksStr == null) || (allTasksStr == "") ) {
            allTasks = Array();
        } else {
            allTasks = jQuery.parseJSON(allTasksStr);
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
            return new Date(today.getFullYear(), today.getMonth(), today.getDate());
        } else if (completeBy == this.TOMORROW) {
            return ((new Date(today.getFullYear(), today.getMonth(), today.getDate())) + 1);
        } else if (completeBy == this.THIS_WEEK) {
            // assume friday to be the end of the week
            daysToEndOfWeek = 7 - (today.getDay() % 6);
            return ((new Date(today.getFullYear(), today.getMonth(), today.getDate())) + daysToEndOfWeek);
        } else {
            // some date in future
            return new Date(2020, 12, 31);
        }

    }
}
