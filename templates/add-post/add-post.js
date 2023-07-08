$(document).ready(function () {
    const inputFile = $("#input-file");
    inputFile.change(() => {
        const valueFile = $("input[type='file']").val();
        $(".input_file .title").text(valueFile);
    });
    const btnSend = $("#btn_send"),
        previewer = $("#img-post"),
        hintError = $("#hint_err"),
        hintSuccesses = $("#hint_successes"),
        tagsInput = $("#input-tags"),
        tagsArr = tagsInput.tagsinput("items");

    tagsInput.on("beforeItemAdd", (event) => {
        if (tagsArr.length > 2) {
            let textInput = tagsArr[tagsArr.length - 1];
            tagsInput.tagsinput("remove", textInput, {preventPost: true});
        }
    });

    validImgPost(inputFile, previewer, hintError, btnSend);
    btnSend.click(function (e) {
        e.preventDefault();
        fetchPost(btnSend, hintSuccesses, tagsArr);
    });
});
