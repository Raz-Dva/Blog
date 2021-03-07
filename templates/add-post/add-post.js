$(document).ready(function () {
    $("#input-file").change(function () {
      let valueFile = $("input[type='file']").val();
      $(".input_file .title").text(valueFile);
    });
    let inputFile = $("#input-file"),
      previewer = $("#img-post"),
      hintError = $("#hint_err"),
      btnSend = $("#btn_send"),
      hintSuccsses = $("#hint_succsses"),
      tagsInput = $("#input-tags"),
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
    ////// send ////////
    $("#btn_send").click(function (e) {
      e.preventDefault();
      fetchPost(btnSend, hintSuccsses, tagsArr);
    });
  });