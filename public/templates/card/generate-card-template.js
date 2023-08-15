export default function generateCardTemplate(post, postData) {
    return `<div class="col-12 col-sm-6 card-post" data-id="${post._id}">
                            <div class="single-blog-post mb-50 overflow-hidden">
                              <div class="post-thumbnail">
                                <a href="/single-post/${post._id}" class="img_post">
                                  <img
                                    src="${postData.imgPath}"
                                    alt=""
                                  />
                                </a>
                                <div id="loader" class="img-post-loader"></div>
                              </div>
                              <div class="post-content">
                                <p class="post-date">${postData.date}</p>
                                <p class="post-date">${postData.categories}</p>
                                <a href="/single-post/${post._id}" class="post-title">
                                  <h4>${post.title}</h4>
                                </a>
                                <p class="post-excerpt">${postData.text}</p>
                              </div>
                              <hr />
                              <div class="author-comments"><span>by </span>${post.author}</div>
                            </div>
                          </div>`;
}
