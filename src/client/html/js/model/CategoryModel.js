
if (typeof(TaskBoard) == "undefined") {
    TaskBoard = {};
}

TaskBoard.CategoryModel = {
    create: function(name, imageURL, colorHexCode, sharedWith) {
        var categoryId, category, allCategories;
        if (sharedWith == null) {
            sharedWith = new Array();
        }
        categoryId = createUUID();
        category = {
            "categoryId" : categoryId,
            "name" : name,
            "imageURL" : imageURL,
            "colorHexCode" : colorHexCode,
            "sharedWith" : sharedWith
        };
        allCategories = this._allCategories();
        allCategories.push(category);
        this._saveAllCategories(allCategories);
        return categoryId;
    },

    get : function(categoryId) {
        var allCategories, index;
        allCategories = this._allCategories();
        index = this._indexOf(categoryId);
        if (index >= 0) {
            return allCategories[index];
        } else {
            return null;
        }
    },

    getByName : function(categoryName) {
        var allCategories, index;
        allCategories = this._allCategories();
        for (index=0; index < allCategories.length; index++) {
            if (allCategories[index].name == categoryName) {
                return allCategories[index];
            }
        }
        return null;
    },

    save: function(categoryId, name, imageURL, colorHexCode, sharedWith) {
        var allCategories, index;
        if (sharedWith == null) {
            sharedWith = new Array();
        }
        allCategories = this._allCategories();
        index = this._indexOf(categoryId);
        if (index >= 0) {
            allCategories[index].name = name;
            allCategories[index].imageURL = imageURL;
            allCategories[index].colorHexCode = colorHexCode;
            allCategories[index].sharedWith = sharedWith;

            this._saveAllCategories(allCategories);

        }
    },

    delete : function(categoryId) {
        var existingAllCategories, allCategories, index;
        existingAllCategories = this._allCategories();
        allCategories = new Array();
        for (index=0; index < existingAllCategories.length; index++) {
            if (existingAllCategories[index].id != categoryId) {
                allCategories.push(existingAllCategories[index]);
            }
        }
        this._saveAllCategories(allCategories);

    },

    list: function(successCallBack, failureCallBack) {
        var listReq = $.ajax({
            url : "category",
            dataType : "json",
            type : "GET",
            async :true,
            data : {
                "reqType" : "listCategories"
           },
           context : this
        });

        listReq.done(function(result) {
            if (result['success']) {
                this._saveAllCategories(result['payload']);
                successCallBack.call(this, result['payload']);
            } else {
                failureCallBack.call(this, result['errCode'], result['errMsg']);
            }
        });


    },

//    list: function() {
//        return this._allCategories();
//    },

    changePosition: function(categoryId, position) {
        var existingCategories, allCategories;
        var categoryAtPosition, toMoveCategoryPosition, toMoveCategory;
        var currPtr, index;

        existingCategories = this._allCategories();
        if (position >= existingCategories.length) {
            position = existingCategories.length-1;
        }
        categoryAtPosition = existingCategories[position];

        toMoveCategoryPosition = this._indexOf(categoryId);
        if (toMoveCategoryPosition < 0) {
            return;
        }
        toMoveCategory = existingCategories[toMoveCategoryPosition];


        allCategories = new Array();
        currPtr = 0;
        for (index=0; index < existingCategories.length; index++) {
            if (index == position) {
                allCategories[currPtr++] = toMoveCategory;
                allCategories[currPtr++] = existingCategories[index];
            } else if (index == toMoveCategoryPosition) {
                continue;
            } else {
                allCategories[currPtr++] = existingCategories[index];
            }
        }
        this._saveAllCategories(allCategories);
    },

    // check by ignoring case
    _indexOf : function(categoryId) {
        var allCategories, index;
        allCategories = this._allCategories();
        for (index=0; index < allCategories.length; index++) {
            if (allCategories[index].id == categoryId) {
                return index;
            }
        }
        return -1;

    },

    _allCategories: function() {
        var allCategoriesStr, allCategories;
        allCategoriesStr = sessionStorage.getItem("TaskBoard.categories");

        if ((allCategoriesStr == null) || (allCategoriesStr == "") ) {
            allCategories = Array();
        } else {
            allCategories = jQuery.parseJSON(allCategoriesStr);
        }
        return allCategories;

    },

    _saveAllCategories: function(allCategories) {
        var allCategoriesStr;
        if (allCategories == null) {
            return;
        } else {
            allCategoriesStr = JSON.stringify(allCategories);
            sessionStorage.setItem("TaskBoard.categories", allCategoriesStr);
        }
    }
}
