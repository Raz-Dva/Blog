module.exports = function formatDate(date) {
    let newdate = new Date(date),
        month = '' + (newdate.getMonth() + 1),
        day = '' + newdate.getDate(),
        year = newdate.getFullYear();

    if (month.length < 2) 
        month = '0' + month;
    if (day.length < 2) 
        day = '0' + day;
    return  [ year, month, day].join('-');
};
