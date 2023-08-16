import formatDate from '../assets/formatDate.js';
import Toast from './notificationToast.js';
import generateCardTemplate from '../templates/card/generate-card-template.js';
import generateRandomPost from '../templates/random-post/generate-random-post.js';
import generateSlideTemplate from '../templates/slider/generate-slide-template.js';
import APIMethods from './serverAPI.js';
import generateEditCardTemplate from '../templates/card/generate-edit-card.js';

class HandlerPost {
    htmlTemplates = {};
    noImageLocalPath = '/public/img/blog-img/no-image.jpg';
    maxTextLength = 150;
    articles = [];

    constructor() {
        this.categories = '';
        this.randomPost = Math.floor(Math.random() * 4);
        this.Set = new Set();
        this.offset = 0;
        this.htmlTemplates.cards = '';
        this.htmlTemplates.categories = '';
        this.htmlTemplates.slider = '';
        this.htmlTemplates.featuredPost = '';
        this.htmlTemplates.mainPosts = `<div class="widget-title">
                        <h6>Main Posts</h6>
                      </div>`;
    }

    getDataPost(post) {
        const dataPost = {};
        if (typeof post.text === 'string' && post.text.length > this.maxTextLength) {
            dataPost.text = post.text.substr(0, this.maxTextLength) + '...';
        } else {
            dataPost.text = post.text;
        }

        dataPost.date = formatDate(post.date);
        dataPost.imgPath = post?.imgURL ? post.imgURL : this.noImageLocalPath;
        dataPost.categories = post.categories.join('/');
        return dataPost;
    }

    createCategories(post) {
        const categories = post.categories;

        for (let i = 0; i < categories.length; i++) {
            const categoryName = categories[i];
            if (this.Set.has(categoryName)) {
                this.offset++;
            } else {
                this.Set.add(categoryName);
                this.htmlTemplates.categories += `<li><a href="/categories/:${categoryName}">${categoryName}</a></li>`;
            }
        }
    }

    createPostCards(post, postData) {
        const cardTemplate = generateCardTemplate(post, postData)
        this.htmlTemplates.cards += cardTemplate;
    }

    createEditCards(post, postData) {
        const editCardTemplate = generateEditCardTemplate(post, postData);
        this.htmlTemplates.editCards += editCardTemplate;
    }

    showRandomPost(post, postData) {
        this.htmlTemplates.featuredPost = generateRandomPost(post, postData);
    }

    createSliders(post, postData) {
        this.htmlTemplates.slider += generateSlideTemplate(post, postData);
    }

    deletePost(btnDelete) {
        const isDelete = confirm('Are you sure want to delete this post?');
        if (isDelete) {
            const postId = btnDelete.attr('data-id');
            btnDelete.nextAll('#loader:first').css('display', 'flex');
            APIMethods.DELETE(postId).then((post) => {
                btnDelete.nextAll('#loader:first').css('display', 'none');

                if (!post) return;

                this.articles = this.articles.filter((item) => {
                    if (item._id !== post._id) {
                        this.createCategories(item);
                    } else {
                        $('.card-post').remove(`div[data-id='${postId}']`);
                        if (this.articles.length <= 4) {
                            $('#list-arts')[0].innerHTML = '<div class="col-12 col-sm-6"><h2> No more posts </h2></div>';
                        }
                    }
                    return item._id !== post._id;
                });
                $('#block-tags')[0].innerHTML = this.htmlTemplates.categories;
                new Toast().showNotification('success', `Article with id ${post._id} was removed`)
            });
        }
        this.Set = new Set();
        this.htmlTemplates.categories = '';
    }
}

export default new HandlerPost();
