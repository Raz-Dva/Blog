export default function generateRandomPost(post, postData) {
    return `<div class="featured-post-area mb-50">
                                <div class="post-thumbnail mb-30">
                                  <a href="/single-post/${post._id}"
                                    ><img src="${postData.imgPath}" alt=""
                                  /></a>
                                </div>
                                <div class="featured-post-content">
                                   <p class="post-date">${postData.date}</p>
                                   <p class="post-date">${postData.categories}</p>
                                  <a href="/single-post/${post._id}" class="post-title">
                                    <h2>${post.title}</h2>
                                  </a>
                                  <p class="post-excerpt">${postData.text}</p>
                                </div>
                                <div class="post-meta d-flex align-items-center justify-content-between">
                                  <div class="author-comments"><span>by </span>${post.author}</div>
                                </div>
                              </div>`;
}
