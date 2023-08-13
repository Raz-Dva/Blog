import { validImgPost } from '/public/js/validImgPost.js';
import { fetchPost } from '/public/js/fetchPost.js';
import Toast from '../../js/notificationToast.js';

const inputFile = $('#input-file');

inputFile.change(() => {
    const valueFile = $('input[type=\'file\']').val();
    $('.input_file .title').text(valueFile);
});
const btnSend = $('#btn_send'),
    previewer = $('#img-post'),
    hintError = $('#hint_err'),
    hintSuccesses = $('#hint_successes'),
    tagsInput = $('#input-tags'),
    tagsArr = tagsInput.tagsinput('items');

tagsInput.on('beforeItemAdd', () => {
    if (tagsArr.length > 2) {
        const textInput = tagsArr[ tagsArr.length - 1 ];
        tagsInput.tagsinput('remove', textInput, { preventPost: true });
    }
});

validImgPost(inputFile, previewer, hintError, btnSend);
btnSend.click((e) => {
    e.preventDefault();
    fetchPost(btnSend, hintSuccesses, tagsArr, 'POST')
        .then((responseText) => new Toast().showNotification('success', responseText))
        .catch((responseText) => new Toast().showNotification('danger', responseText))
});

