$(document).ready(function () {
  const $posts = $("#list-arts")[0],
    BASEURL = "/articles",
    $categories = $('#block-tags')[0],
    $slider = $('#wrap-slider')[0],
    $featuredPost = $('#featured-post')[0]
  $mainPposts = $('#main-posts')[0];
  //////  CLASS API //////////
  class ArtApi {
    static fetch() {
      return fetch(BASEURL, { method: "get" }).then((res) => {
        return res.json();
      });
    }
    static remove(id) {
      return fetch(`${BASEURL}/${id}`, { method: "delete" })
        .then((res) => { return res.json() }
        )
    }
  };
  ////// api fetch ///////
  let rendering = () => {
    let renderClass = new RenderHTML();
    ArtApi.fetch().then((backendArticles) => {
      articles = backendArticles.concat();
      articles.forEach((item, index) => {
        let dataPost = renderClass.getDataPost(item);
        renderClass.getCategories(item);
        if (renderClass.randomPost == index) renderClass.showRandomPost(item, dataPost);
        if (index < 5) {
          renderClass.getSlider(item, dataPost);
          indexHtml.cardsEmpty = `<div class="col-12 col-sm-6"><h2> No posts </h2></div>`;
        } else {
          indexHtml.cardsEmpty = '';
          renderClass.getCards(item, dataPost);
        }
      });
      $featuredPost.innerHTML = indexHtml.featuredPost;
      $categories.innerHTML = indexHtml.categories;
      $posts.innerHTML = indexHtml.cardsEmpty + indexHtml.cards;
      $slider.innerHTML = indexHtml.slider;
      indexHtml.categories = '';
      indexHtml.cards = '';
      indexHtml.slider = '';
      renderClass.Set = new Set();
    })
      .then(() => {
        let script = document.createElement('script');
        let body = $('body')[0];
        script.type = 'text/javascript';
        script.src = '/public/js/staticHtml.js';
        body.appendChild(script);
        $(".remove_post").click(function () {
          var question = confirm('Are you sure want to delete this post?');
          if (question) {
            const postId = $(this).attr("data-id");
            ArtApi.remove(postId).then((post) => {
              ///////////////// if error 
              articles = articles.filter(function (item) {
                if (item._id !== post._id) {
                  renderClass.getCategories(item);
                } else {
                  $(`.card-post`).remove(`div[data-id='${postId}']`);
                  if (articles.length <= 6) {
                    $posts.innerHTML = `<div class="col-12 col-sm-6"><h2> No posts </h2></div>`;
                  }
                }
                return item._id !== post._id;
              });
              $categories.innerHTML = indexHtml.categories;
            });
          };
          renderClass.Set = new Set();
          indexHtml.categories = '';
        });
      });
  }
  rendering();
});
