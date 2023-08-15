import formatDate from '../../public/assets/formatDate.js';

export default function generateCardPost(post, imagePath, postText) {
    return `<div class="single-latest-post d-flex">
                  <div class="post-thumb">
                    <a class="post-img" href="/single-post/${post._id}">
                        <img
                        src="${imagePath}"
                        alt=""
                        />
                     </a>
                    <p class="post-date">${formatDate(post.date)}</p>
                    <p class="post-date">${post.categories.join('/')}</p>
                  </div>
                  <div class="post-content">
                  <a href="/single-post/${post._id}" class="post-title">
                      <h6>${post.title}</h6>
                  </a>
                  <p class="post-excerpt">${postText}</p>
                  <p class="post-author"><span>by</span> Colorlib</p>
                  </div>
              </div>`;
}
