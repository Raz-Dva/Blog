import apiMethods from '../../js/serverAPI.js';
import handlerPost from '../../js/handlerPost.js';

const $categories = $('#block-tags')[0],
    $posts = $('#block-posts')[0];

apiMethods.GET().then((res) => {
    if (!res) return;
    handlerPost.articles = res;
    handlerPost.articles.forEach((item) => {
        const dataPost = handlerPost.getDataPost(item);

        handlerPost.createCategories(item);
        handlerPost.htmlTemplates.noPosts = '';
        handlerPost.createEditCards(item, dataPost);
    });

    $categories.innerHTML = handlerPost.htmlTemplates.categories;
    $posts.innerHTML = handlerPost.htmlTemplates.editCards;
    handlerPost.htmlTemplates.categories = '';
    handlerPost.htmlTemplates.cards = '';

    $('.remove_post').click(function() {
        handlerPost.deletePost($(this))
    });
});
