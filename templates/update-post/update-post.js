$(document).ready(function () {
    let inputFile = $("#input-file"),
        previewer = $("#img-post"),
        hintError = $("#hint_err"),
        btnSend = $("#btn_send"),
        tagsInput = $("#input-tags"),
        tagsArr = tagsInput.tagsinput("items"),
        hintSuccsses = $("#hint_succsses");
    /////// valid input tags ////////
    tagsArr = tagsInput.tagsinput("items");
    tagsInput.on("beforeItemAdd", function (event) {
        if (tagsArr.length > 2) {
            let textInput = tagsArr[tagsArr.length - 1];
            tagsInput.tagsinput("remove", textInput, { preventPost: true });
        }
    });
    ///// valid img //////
    validImgPost(inputFile, previewer, hintError, btnSend);
    ///// fetch //////
    $("#btn_send").click(function (e) {
        e.preventDefault();
        fetchPost(btnSend, hintSuccsses, tagsArr);
    });
});
