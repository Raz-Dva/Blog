import handlerPost from './handlerPost.js';
import apiMethods from './serverAPI.js';

const $posts = $('#list-arts')[0],
    $categories = $('#block-tags')[0],
    $slider = $('#wrap-slider')[0],
    $featuredPost = $('#featured-post')[0],
    $preloader = $('#preloader')[0];

export default function() {
    return apiMethods.GET().then((res) => {
        if (!res) return;
        handlerPost.articles = res;
        handlerPost.articles.forEach((item, index) => {
            const dataPost = handlerPost.getDataPost(item);
            handlerPost.createCategories(item);
            if (handlerPost.randomPost === index) {
                handlerPost.showRandomPost(item, dataPost);
            }
            if (index < 3) {
                handlerPost.createSliders(item, dataPost);
                handlerPost.htmlTemplates.noPosts = '<div class="col-12 col-sm-6"><h2> No more posts </h2></div>';
            } else {
                handlerPost.htmlTemplates.noPosts = '';
                handlerPost.createPostCards(item, dataPost);
            }
        });
        $featuredPost.innerHTML = handlerPost.htmlTemplates.featuredPost;
        $categories.innerHTML = handlerPost.htmlTemplates.categories;
        $posts.innerHTML = handlerPost.htmlTemplates.noPosts + handlerPost.htmlTemplates.cards;
        $preloader.style.display = 'none';
        $slider.innerHTML = handlerPost.htmlTemplates.slider;
        handlerPost.htmlTemplates.categories = '';
        handlerPost.htmlTemplates.cards = '';
        handlerPost.htmlTemplates.slider = '';
        handlerPost.Set = new Set();
    });
}
