function validImgPost(input, img, hint, btn) {
    function validateImage() {
        var formData = new FormData();
        var file = input[0].files[0];
        formData.append("Filedata", file);
        var t = file.type.split("/").pop().toLowerCase();
        if (
            t != "jpeg" &&
            t != "jpg" &&
            t != "png" &&
            t != "bmp" &&
            t != "gif" 
        ) {
            hint
                .removeClass("d-none")
                .html("Please select a valid image file");
            btn.attr("disabled", true);

            input[0].value = "";
            img[0].src = "";
            return false;
        }
        if (file.size > 1024000) {
            hint.removeClass("d-none").html("Max Upload size is 1MB only");
            btn.attr("disabled", true);
            input[0].value = "";
            img[0].src = "";
            return false;
        }
        return true;
    }
    input.change(function (evt) {
        if (validateImage()) {
            hint.addClass("d-none");
            btn.attr("disabled", false);
            evt.stopPropagation();
            evt.preventDefault();
            var files = evt.target.files;
            var file = files[0];
            var fileReader = new FileReader();
            fileReader.onload = function () {
                var url = fileReader.result;
                img[0].src = url;
            };
            // Read file asynchronously.
            fileReader.readAsDataURL(file); // fileReader.result -> URL.
        }
    });

}