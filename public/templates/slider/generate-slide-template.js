export default function generateSlideTemplate(post, postData) {
    return `<div class="single-hero-post d-flex flex-wrap">
                            <div
                              class="slide-post-thumbnail h-100 bg-img"
                              style="
                                background-image: url(${postData.imgPath});
                              "
                            ></div>
                            <div class="slide-post-content h-100 d-flex align-items-center">
                              <div class="slide-post-text">
                                <p class="post-date" data-animation="fadeIn" data-delay="100ms">
                                  ${postData.date}
                                </p>
                                <p class="post-date">${postData.categories}</p>
                                <a
                                  href="${post._id}"
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
                                  >Read More
                                </a>
                              </div>
                            </div>
                          </div>`
}
