
String.prototype.format = String.prototype.f = function() {
    var s = this,
        i = arguments.length;

    while (i--) {
        s = s.replace(new RegExp('\\{' + i + '\\}', 'gm'), arguments[i]);
    }
    return s;
};

function createUUID() {
    // http://www.ietf.org/rfc/rfc4122.txt
    var s = [];
    var hexDigits = "0123456789abcdef";
    for (var i = 0; i < 36; i++) {
        s[i] = hexDigits.substr(Math.floor(Math.random() * 0x10), 1);
    }
    s[14] = "4";  // bits 12-15 of the time_hi_and_version field to 0010
    s[19] = hexDigits.substr((s[19] & 0x3) | 0x8, 1);  // bits 6-7 of the clock_seq_hi_and_reserved to 01
    s[8] = s[13] = s[18] = s[23] = "-";

    var uuid = s.join("");
    return uuid;
}

function getLocalDay() {
   var weekDayToStr = {
      0 : 'Sunday',
      1 : 'Monday',
      2 : 'Tuesday',
      3 : 'Wednesday',
      4 : 'Thursday',
      5 : 'Friday',
      6 : 'Saturday'
   };
   var nowDate = new Date();
   return weekDayToStr[nowDate.getDay()];

}

function getLocalDateSting() {
    var monthToString = {
        0 : 'Jan',
        1 : 'Feb',
        2 : 'Mar',
        3 : 'Apr',
        4 : 'May',
        5 : 'Jun',
        6 : 'Jul',
        7 : 'Aug',
        8 : 'Sep',
        9 : 'Oct',
        10 : 'Nov',
        11 : 'Dec'
    };
    var nowDate = new Date();
    var localDay = nowDate.getDate();
    var monthDayStr = monthToString[nowDate.getMonth()];
    var year = nowDate.getFullYear();
    var nowDateStr = "{0} {1}, {2}".format(monthDayStr, localDay, year);
    return nowDateStr;
}

function createStandardCategories() {
    var homeCategory = TaskBoard.CategoryModel.getByName("Home");
    var workCategory = TaskBoard.CategoryModel.getByName("Work");
    if (homeCategory == null) {
        TaskBoard.CategoryModel.create("Home", "images/home.png", "CFF", null);
    }
    if (workCategory == null) {
        TaskBoard.CategoryModel.create("Work", "images/work.png", "FFECE5", null);
    }
}

function getStartOfWeekDate() {
    var currDate = new Date();
    var first = currDate.getDate() - currDate.getDay(); // First day is the day of the month - the day of the week
    var startOfWeekDate = new Date()
    startOfWeekDate.setDate(first);
    return startOfWeekDate;
}

function getTimeDiffInStr(refDate) {
    var now = new Date();
    var value;
    var secsDiff = (now.getTime() - refDate.getTime())/1000;
    if (Math.floor(secsDiff/ 86400) >= 1)  {
        value =  Math.floor(secsDiff/ 86400);
        return value + (value > 1 ? " days " : " day ");
    } else if (Math.floor(secsDiff/ 3600) >= 1)  {
        value = Math.floor(secsDiff/ 3600);
        return value + (value > 1 ? " hours " : " hour ");
    } else if (Math.floor(secsDiff/ 60) >= 1)  {
        value = Math.floor(secsDiff/ 60);
        return value + (value > 1 ?  " mins " : " min ");
    } else {
        value = Math.floor(secsDiff);
        if (value <= 0) {
           value = 1;
        }
        return value + (value > 1 ? " secs " : " sec ");
    }
}


function getTaskTitleSubstring(taskTitle) {
   if (taskTitle.length > 64) {
      taskTitle = taskTitle.substring(0, 60) + "...";
   }
   return taskTitle;

}
