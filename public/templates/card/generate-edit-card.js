export default function generateEditCardTemplate(post, postData) {
    return `<div class="single-latest-post d-flex" id="${post._id}">
              <div class="post-thumb">
                <div class="post-img editable_post">
                  <a href="/update-post/${post._id}" class="edit_post">
                    <i class="fa fa-pencil"></i>
                  </a>
                  <button data-id="${post._id}" class="remove_post">
                    <i class="fa fa-remove"></i>
                  </button>
                  <div class="loader"></div>
                  <img
                    src="${postData.imgPath}"
                    alt=""
                  />
                  <div id="loader" class="img-post-loader"></div>
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
