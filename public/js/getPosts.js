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
    articles = res.concat(); // []
    articles.forEach((item, index) => {
        const dataPost = handlerPost.getDataPost(item);  // prepeare data post
        handlerPost.getCategories(item);  // set categories indexHtml.categories
        if (handlerPost.randomPost === index) {
            handlerPost.showRandomPost(item, dataPost); // add html random post
        }
        if (index < 3) {
            handlerPost.getSlider(item, dataPost); // concatin sliders indexHtml.slider
            handlerPost.indexHtml.noPosts = '<div class="col-12 col-sm-6"><h2> No more posts </h2></div>';
        } else {
            handlerPost.indexHtml.noPosts = '';
            handlerPost.getCards(item, dataPost); // prepear cards (concatin) indexHtml.cards
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


