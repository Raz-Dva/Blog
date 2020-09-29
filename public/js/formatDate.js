(function () {
    window.DateStr = function (date) {
        this.date = date;       
    };
    DateStr.prototype.formatDate = function () {
        var d = new Date(this.date),
            month = "" + (d.getMonth() + 1),
            day = "" + d.getDate(),
            year = d.getFullYear();

        if (month.length < 2) month = "0" + month;
        if (day.length < 2) day = "0" + day;

        return [year, month, day].join("-");
    };
})();