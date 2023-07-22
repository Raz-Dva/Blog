export const fetchPost = (btn, hint, tags, method) => {
    const form = $("#form");
    const formData = new FormData(form[0]);
    const topMarginHeader = 90;

    formData.delete('tagsPost');
    formData.append('tagsPost', JSON.stringify(tags));

    for (let pair of formData.entries()) {
        if (!pair[1] && pair[0] !== 'oldImg') {
            $(`.form-control[name=${pair[0]}]`).addClass('is-invalid');
            const offsetTopInput = Math.round($('.is-invalid').offset().top) - topMarginHeader;

            $('html, body').animate({scrollTop: offsetTopInput}, 200);
            return false

        } else {
            $(`.form-control[name=${pair[0]} ]`).removeClass('is-invalid')
            btn.html("Send").attr("disabled", false);
        }
    }

    btn.attr("disabled", true);

    fetch(form.attr("action"), {
        method: method,
        body: formData,
    })
        .then((res) => {
            if (res.ok) {
                for (let pair of formData.entries()) {
                    $(`.form-control[name=${pair[0]}]`).val('');
                    $("#img-post").attr('src', '')
                }
                res.text().then((text) => {
                    btn.addClass("successes").html("Successes").attr("disabled", true);
                    hint.removeClass("d-none").html(text);
                    setTimeout(() => {
                        btn.removeClass("successes").html("Send").attr("disabled", false);
                        hint.addClass("d-none").html('');
                    }, 3000);
                });
            } else {
                res.text().then((text) => {
                    hint
                        .removeClass("d-none text-danger")
                        .addClass("text-danger").html(text);
                });
            }
        })
        .catch((error) => {
            console.error('Error fetch response:', error);
        });
}
