
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

function getLocalDateSting() {
    var monthDayToString = {
        0 : 'January',
        1 : 'February',
        2 : 'March',
        3 : 'April',
        4 : 'May',
        5 : 'June',
        6 : 'July',
        7 : 'August',
        8 : 'September',
        9 : 'October',
        10 : 'November',
        11 : 'December'
    };
    var nowDate = new Date();
    var localDate = nowDate.getDate();
    var monthDayStr = monthDayToString[nowDate.getMonth()];
    var year = nowDate.getFullYear();
    var nowDateStr = "{0} {1}, {2}".format(monthDayStr, nowDate, year);
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