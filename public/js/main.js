import RenderHTML from './renderHtml.js'

$(document).ready(function () {
    const $posts = $("#list-arts")[0],
        BASEURL = "/articles",
        $categories = $('#block-tags')[0],
        $slider = $('#wrap-slider')[0],
        $featuredPost = $('#featured-post')[0],
        $preloader = $('#preloader')[0];

    //////  CLASS API //////////
    class ArtApi {
        static fetch() {
            return fetch(BASEURL, {method: "get"}).then((res) => {
                return res.json();
            });
            // add catch err
        }
        static remove(id) {
            return fetch(`delete/${id}`, {method: "delete"})
                .then((res) => {
                        if (!res.ok) {
                            return alert(res.statusText)
                        }
                        return res.json()
                    }
                )
        }
    }

    ////// api fetch ///////
    let articles = [];

    const rendering = () => {
        let renderer = new RenderHTML();
        ArtApi.fetch().then((backendArticles) => {
            articles = backendArticles.concat();
            articles.forEach((item, index) => {
                let dataPost = renderer.getDataPost(item);
                renderer.getCategories(item);
                if (renderer.randomPost === index) renderer.showRandomPost(item, dataPost);
                if (index < 3) {
                    renderer.getSlider(item, dataPost);
                    renderer.indexHtml.cardsEmpty = `<div class="col-12 col-sm-6"><h2> No more posts </h2></div>`;
                } else {
                    renderer.indexHtml.cardsEmpty = '';
                    renderer.getCards(item, dataPost);
                }
            });
            $featuredPost.innerHTML = renderer.indexHtml.featuredPost;
            $categories.innerHTML = renderer.indexHtml.categories;
            $posts.innerHTML = renderer.indexHtml.cardsEmpty + renderer.indexHtml.cards;
            $preloader.style.display = 'none';
            $slider.innerHTML = renderer.indexHtml.slider;
            renderer.indexHtml.categories = '';
            renderer.indexHtml.cards = '';
            renderer.indexHtml.slider = '';
            renderer.Set = new Set();
        })
            .then(() => {
                let script = document.createElement('script');
                let body = $('body')[0];
                script.type = 'text/javascript';
                script.src = '/public/js/staticHtml.js';
                body.appendChild(script);
                $(".remove_post").click(function () {
                    const question = confirm('Are you sure want to delete this post?');
                    if (question) {
                        const postId = $(this).attr("data-id");
                        ArtApi.remove(postId).then((post) => {
                            articles = articles.filter(function (item) {
                                if (item._id !== post._id) {
                                    renderer.getCategories(item);
                                } else {
                                    $(`.card-post`).remove(`div[data-id='${postId}']`);
                                    if (articles.length <= 4) {
                                        $posts.innerHTML = `<div class="col-12 col-sm-6"><h2> No more posts </h2></div>`;
                                    }
                                }
                                return item._id !== post._id;
                            });
                            $categories.innerHTML = renderer.indexHtml.categories;
                        });
                    }
                    renderer.Set = new Set();
                    renderer.indexHtml.categories = '';
                });
            });
    }
    rendering();
});
