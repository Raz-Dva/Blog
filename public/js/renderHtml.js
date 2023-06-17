let articles = [];
let indexHtml = {};
indexHtml.cards = '';
indexHtml.categories = '';
indexHtml.slider = '';
indexHtml.featuredPost = '';
indexHtml.mainPosts = `<div class="widget-title">
                        <h6>Main Posts</h6>
                      </div>`;

class RenderHTML {
    constructor() {
        this.categories = '';
        this.randomPost = Math.floor(Math.random() * 4);
        this.Set = new Set();
        this.offset = 0;
    };

    getDataPost(post) {
        const dataPost = {};
        if (typeof post.text === "string" && post.text.length > 150) {
            dataPost.text = post.text.substr(0, 150) + "...";
        } else dataPost.text = post.text;
        dataPost.date = new DateStr(post.date).formatDate();
        dataPost.imgPath = post?.imgPath ? post.imgPath : 'no-image.jpg';
        dataPost.categories = post.categories.join("/");
        return dataPost;
    };

    getCategories(post) {
        let arrCategories = post.categories;
        const len = arrCategories.length;
        for (let i = 0; i < len; i++) {
            let val = arrCategories[i];
            if (this.Set.has(val)) {
                this.offset++;
            } else {
                this.Set.add(val);
                indexHtml.categories += `<li><a href="/categories/:${val}">${val}</a></li>`;
            }
        }
    };

    getCards(post, postData) {
        indexHtml.cards += `<div class="col-12 col-sm-6 card-post" data-id="${post._id}">
                            <div class="single-blog-post mb-50 overflow-hidden">
                              <div class="post-thumbnail">
                                <a href="/update-post/${post._id}" class="edit_post"
                                  ><i class="fa fa-pencil"></i
                                ></a>
                                <button data-id="${post._id}" class="remove_post">
                                  <i class="fa fa-remove"></i>
                                </button>
                                <a href="/single-post/${post._id}" class="img_post">
                                  <img
                                    src="../public/img/blog-img/${postData.imgPath}"
                                    alt=""
                                  />
                                </a>
                              </div>
                              <div class="post-content">
                                <p class="post-date">${postData.date}/${postData.categories}</p>
                                <a href="/single-post/${post._id}" class="post-title">
                                  <h4>${post.title}</h4>
                                </a>
                                <p class="post-excerpt">${postData.text}</p>
                              </div>
                              <hr />
                              <div class="author-comments"><span>by </span>${post.author}</div>
                            </div>
                          </div>`;
    };

    showRandomPost(post, postData) {
        indexHtml.featuredPost = `<div class="featured-post-area mb-50">
                                <div class="post-thumbnail mb-30">
                                  <a href="/single-post/${post._id}"
                                    ><img src="../public/img/blog-img/${postData.imgPath}" alt=""
                                  /></a>
                                </div>
                                <div class="featured-post-content">
                                  <p class="post-date">${postData.date}/${postData.categories}</p>
                                  <a href="/single-post/${post._id}" class="post-title">
                                    <h2>${post.title}</h2>
                                  </a>
                                  <p class="post-excerpt">${postData.text}</p>
                                </div>
                                <div class="post-meta d-flex align-items-center justify-content-between">
                                  <div class="author-comments"><span>by </span>${post.author}</div>
                                </div>
                              </div>`;
    };

    getSlider(post, postData) {
        indexHtml.slider += `<div class="single-hero-post d-flex flex-wrap">
                            <div
                              class="slide-post-thumbnail h-100 bg-img"
                              style="
                                background-image: url('../public/img/blog-img/${postData.imgPath}');
                              "
                            ></div>
                            <div class="slide-post-content h-100 d-flex align-items-center">
                              <div class="slide-post-text">
                                <p class="post-date" data-animation="fadeIn" data-delay="100ms">
                                  ${postData.date}/${postData.categories}
                                </p>
                                <a
                                  href="/single-post/${post._id}"
                                  class="post-title"
                                  data-animation="fadeIn"
                                  data-delay="100ms"
                                >
                                  <h2>${post.title}</h2>
                                </a>
                                <p class="post-excerpt" data-animation="fadeIn" data-delay="100ms">
                                  ${postData.text}
                                </p>
                                <a
                                  href="/single-post/${post._id}"
                                  class="btn nikki-btn"
                                  data-animation="fadeIn"
                                  data-delay="100ms"
                                  >Read More</a
                                >
                              </div>
                            </div>
                          </div>`;
    }
}
