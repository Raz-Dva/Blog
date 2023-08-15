import handlerPost from '../../js/handlerPost.js';

const $categories = $('#block-tags')[ 0 ];

fetch('/articles', { method: 'get' })
    .then((res) => {
        return res.json();
    })
    .then((data) => {
        if (data.length > 0) {
            data.forEach((item) => {
                handlerPost.createCategories(item);
            });
            $categories.innerHTML = handlerPost.htmlTemplates.categories;
        } else {
            $categories.innerHTML = '<h3>No categories</h3>';
        }
    });
