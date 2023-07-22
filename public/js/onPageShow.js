import formatDate from "../assets/formatDate.js";

const getPosts = (id) => {
    fetch(`/post/${id}`, { method: "get" })
        .then((res) => res.json())
        .then((post) => {
                const dataPost = {};
                if (typeof post.text === "string" && post.text.length > 150) {
                    dataPost.text = post.text.substr(0, 150) + "...";
                } else {
                    dataPost.text = post.text;
                }
                dataPost.date = formatDate(post.date);
                dataPost.imgPath = post?.imgURL ? post.imgURL : '../public/img/blog-img/no-image.jpg';
                dataPost.categories = post.categories.join("/");

            $(`div[data-id='${id}']`).html(`<div class="single-blog-post mb-50 overflow-hidden">
                              <div class="post-thumbnail">
                                <a href="/update-post/${post._id}" class="edit_post"
                                  ><i class="fa fa-pencil"></i
                                ></a>
                                <button data-id="${post._id}" class="remove_post">
                                  <i class="fa fa-remove"></i>
                                </button>
                                <a href="/single-post/${post._id}" class="img_post">
                                  <img
                                    src="${dataPost.imgPath}"
                                    alt=""
                                  />
                                </a>
                              </div>
                              <div class="post-content">
                                <p class="post-date">${dataPost.date}</p>
                                <p class="post-date">${dataPost.categories}</p>
                                <a href="/single-post/${post._id}" class="post-title">
                                  <h4>${post.title}</h4>
                                </a>
                                <p class="post-excerpt">${dataPost.text}</p>
                              </div>
                              <hr />
                              <div class="author-comments"><span>by </span>${post.author}</div>
                            </div>`)
        })
        .catch((err) => {
            console.error(err)
        })
}

window.addEventListener("pageshow", function (event) {
    const updatedPostId = localStorage.getItem('updatedPostId');
    const fromPageUpdate = localStorage.getItem('fromUrl');

    localStorage.removeItem('updatedPostId');
    localStorage.removeItem('fromUrl')

    var historyTraversal = event.persisted ||
        (typeof window.performance != "undefined" &&
            window.performance.navigation.type === 2);
    if (historyTraversal && updatedPostId && fromPageUpdate && fromPageUpdate.startsWith('/update-post/')) {
        getPosts(updatedPostId)
    }
});

