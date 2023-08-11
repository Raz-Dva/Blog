import HandlerPost from './renderHtml.js';
import APIMethods from './serverAPI.js';

let articles = [];
const handlerPost = new HandlerPost();
const $posts = $('#list-arts')[ 0 ],
    $categories = $('#block-tags')[ 0 ],
    $slider = $('#wrap-slider')[ 0 ],
    $featuredPost = $('#featured-post')[ 0 ],
    $preloader = $('#preloader')[ 0 ];


APIMethods.GET().then((res) => {
    if (!res) return;
    articles = res;
    articles.forEach((item, index) => {
        const dataPost = handlerPost.getDataPost(item);
        handlerPost.getCategories(item);
        if (handlerPost.randomPost === index) {
            handlerPost.showRandomPost(item, dataPost);
        }
        if (index < 3) {
            handlerPost.getSlider(item, dataPost);
            handlerPost.indexHtml.noPosts = '<div class="col-12 col-sm-6"><h2> No more posts </h2></div>';
        } else {
            handlerPost.indexHtml.noPosts = '';
            handlerPost.getCards(item, dataPost);
        }
    });
    $featuredPost.innerHTML = handlerPost.indexHtml.featuredPost;
    $categories.innerHTML = handlerPost.indexHtml.categories;
    $posts.innerHTML = handlerPost.indexHtml.noPosts + handlerPost.indexHtml.cards;
    $preloader.style.display = 'none';
    $slider.innerHTML = handlerPost.indexHtml.slider;
    handlerPost.indexHtml.categories = '';
    handlerPost.indexHtml.cards = '';
    handlerPost.indexHtml.slider = '';
    handlerPost.Set = new Set();

    $('.remove_post').click(function () {
        handlerPost.deletePost($(this), APIMethods, articles)
    });
})
    .then(() => {
        const script = document.createElement('script');
        const body = $('body')[0];
        script.type = 'text/javascript';
        script.src = '/public/js/active.js';
        body.appendChild(script);
    });


