function fetchPost(btn, hint, tags) {
    const form = $("#form");
    const formData = new FormData(form[0]);
    
    formData.delete('tagsPost');
    formData.append('tagsPost', JSON.stringify(tags));

    for (let pair of formData.entries()) {
        if (!pair[1] && pair[0] !== 'oldImg') {
            $(`.form-control[name=${pair[0]}]`).addClass('is-invalid')
            return false

        } else {
            $(`.form-control[name=${pair[0]} ]`).removeClass('is-invalid')
            btn.html("Send").attr("disabled", false);
        }
    } 
    fetch(form.attr("action"), {
        method: "POST",
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
