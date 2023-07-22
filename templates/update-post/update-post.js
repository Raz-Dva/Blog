import { fetchPost } from "../../public/js/fetchPost.js"
import { validImgPost } from "../../public/js/validImgPost.js"

const inputFile = $("#input-file"),
    postId = $("#post-id"),
    previewer = $("#img-post"),
    hintError = $("#hint_err"),
    btnSend = $("#btn_send"),
    tagsInput = $("#input-tags"),
    loader = $("#loader"),
    hintSuccesses = $("#hint_successes");
let tagsArr = tagsInput.tagsinput("items").itemsArray;

localStorage.setItem('updatedPostId', postId.text())

previewer.one('load', () => {
    loader.css("display", "none")
}).each(function () {
    if (this.complete) {
        $(this).load();
    }
});

tagsInput.on("beforeItemAdd", (event) => {
    if (tagsArr.length > 2) {
        let textInput = tagsArr[tagsArr.length - 1];
        tagsInput.tagsinput("remove", textInput, {preventPost: true});
    }
});

validImgPost(inputFile, previewer, hintError, btnSend);
btnSend.click(function (e) {
    e.preventDefault();
    fetchPost(btnSend, hintSuccesses, tagsArr, "PUT");
});

