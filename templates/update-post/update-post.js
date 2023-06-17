$(document).ready(function () {
    const inputFile = $("#input-file"),
        postId = $("#post-id"),
        previewer = $("#img-post"),
        hintError = $("#hint_err"),
        btnSend = $("#btn_send"),
        tagsInput = $("#input-tags"),
        hintSuccsses = $("#hint_succsses");
    let tagsArr = tagsInput.tagsinput("items");

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
    btnSend.click(function (e) {
        e.preventDefault();
        localStorage.setItem('updatedPostId', postId.text())
        fetchPost(btnSend, hintSuccsses, tagsArr);
    });

    /////////
    // addEventListener('beforeunload', (event) => {
    //
    //     // event.preventDefault(); /*✔️ To show a dialog we need this preventDefault() */
    //
    //     //
    //     // do some action
    //     //
    //     // alert('++++')
    //     console.log()
    //     // return event.returnValue = ''; /*✔️ Need to return a value */
    //     return ''
    // });
    ////////////////////
    // history.pushState({}, '', '/');
    // addEventListener("popstate", (event) => {
    //     alert('+++')
    //     event.preventDefault();
    // });
    // window.onpopstate = function(event) {
    //     // event.preventDefault();
    //     alert('+++')
    // };
});
