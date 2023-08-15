export default function generateEditCardTemplate(post, postData) {
    return `<div class="single-latest-post d-flex">
              <div class="post-thumb">
                <div class="post-img editable_post">
                  <a href="/update-post/${post._id}" class="edit_post">
                    <i class="fa fa-pencil"></i>
                  </a>
                  <button data-id="${post._id}" class="remove_post">
                    <i class="fa fa-remove"></i>
                  </button>
                  <img
                    src="${postData.imgPath}"
                    alt=""
                  />
                </div>
                <p class="post-date">${postData.date}</p>
                <p class="post-date">${postData.categories}</p>
              </div>
              <div class="post-content">
              <a href="/single-post/${post._id}" class="post-title">
                  <h6>${post.title}</h6>
              </a>
              <p class="post-excerpt">${postData.text}</p>
              <p class="post-author"><span>by</span> Colorlib</p>
              </div>
            </div>`
}
