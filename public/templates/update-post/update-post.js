import { fetchPost } from '../../js/fetchPost.js';
import { validImgPost } from '../../js/validImgPost.js';
import Toast from '../../js/notificationToast.js';

const inputFile = $('#input-file'),
    postId = $('#post-id'),
    previewer = $('#img-post'),
    hintError = $('#hint_err'),
    btnSend = $('#btn_send'),
    tagsInput = $('#input-tags'),
    loader = $('#loader'),
    hintSuccesses = $('#hint_successes'),
    tagsArr = tagsInput.tagsinput('items');

previewer.one('load', () => {
    loader.css('display', 'none');
}).each(function() {
    if (this.complete) {
        $(this).load();
    }
});

tagsInput.on('beforeItemAdd', () => {
    if (tagsArr.length > 2) {
        const textInput = tagsArr[tagsArr.length - 1];
        tagsInput.tagsinput('remove', textInput, { preventPost: true });
    }
});

validImgPost(inputFile, previewer, hintError, btnSend);
btnSend.click(function(e) {
    e.preventDefault();
    localStorage.setItem('updatedPostId', postId.text());
    fetchPost(btnSend, hintSuccesses, tagsArr, 'PUT')
        .then((responseText) => new Toast().showNotification('success', responseText))
        .catch((responseText) => new Toast().showNotification('danger', responseText))
});
