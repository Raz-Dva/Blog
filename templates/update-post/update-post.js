$(document).ready(function () {
    const inputFile = $("#input-file"),
        postId = $("#post-id"),
        previewer = $("#img-post"),
        hintError = $("#hint_err"),
        btnSend = $("#btn_send"),
        tagsInput = $("#input-tags"),
        loader = $("#loader"),
        hintSuccesses = $("#hint_successes");
    let tagsArr = tagsInput.tagsinput("items");

    previewer.one('load', () => {
        loader.css("display", "none")
    }).each(function() {
        if(this.complete) {
            $(this).load();
        }
    });
    tagsArr = tagsInput.tagsinput("items");
    tagsInput.on("beforeItemAdd",  (event) => {
        if (tagsArr.length > 2) {
            let textInput = tagsArr[tagsArr.length - 1];
            tagsInput.tagsinput("remove", textInput, { preventPost: true });
        }
    });

    validImgPost(inputFile, previewer, hintError, btnSend);

    btnSend.click(function (e) {
        e.preventDefault();
        localStorage.setItem('updatedPostId', postId.text())
        fetchPost(btnSend, hintSuccesses, tagsArr);
    });
});
