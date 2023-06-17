$(document).ready(function () {
    const inputFile = $("#input-file");
    inputFile.change(function () {
      var valueFile = $("input[type='file']").val();
      $(".input_file .title").text(valueFile);
    });
    const btnSend = $("#btn_send");
    let previewer = $("#img-post"),
      hintError = $("#hint_err"),
      hintSuccsses = $("#hint_succsses"),
      tagsInput = $("#input-tags"),
      form = $("#form");
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
    btnSend.click(function (e) {
      e.preventDefault();
      fetchPost(btnSend, hintSuccsses, tagsArr);
    });
  });
