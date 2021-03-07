function fetchPost(btn, hint, tags) {
    let formData = new FormData($("#form")[0]);
    // let tagsInput1 = $("#input-tags");    
    // let tags = tagsInput1.tagsinput('items');
    // console.log(inputTags.val())
    
    formData.delete('tagsPost');
    formData.append('tagsPost', JSON.stringify(tags));

    // formData.append('tagsPost', JSON.stringify(tagsInput));
    // console.log(typeof JSON.stringify(tagsInput))

    for (let pair of formData.entries()) {
        // console.log(pair[0] + '==' + pair[1])
        if (pair[1] === undefined || pair[1] === null || pair[1] === '') {

            $(`.form-control[name=${pair[0]}]`).addClass('is-invalid')
            return false

        } else {
            $(`.form-control[name=${pair[0]} ]`).removeClass('is-invalid')
            btn.html("Send").attr("disabled", false);
        }
    } 
    fetch($("#form").attr("action"), {
        method: $("#form").attr("method"),
        body: formData,
    }).then((res) => {
        if (res.ok) {
            for (let pair of formData.entries()) {
                $(`.form-control[name=${pair[0]}]`).val('');
                $("#img-post").attr('src', '')
            }
            res.text().then(function (text) {
                btn.addClass("succsses").html("Succsses").attr("disabled", true);
                hint.removeClass("d-none").html(text);
                setTimeout(() => {
                    btn.removeClass("succsses").html("Send").attr("disabled", false);
                    hint.addClass("d-none").html('');
                }, 3000);
            });
        }
    })
    .catch((error) => {
            console.error('Error fetch response:', error);
        });
}