import RenderHTML from './renderHtml.js';

const $posts = $( '#list-arts' )[ 0 ],
    BASEURL = '/articles',
    $categories = $( '#block-tags' )[ 0 ],
    $slider = $( '#wrap-slider' )[ 0 ],
    $featuredPost = $( '#featured-post' )[ 0 ],
    $preloader = $( '#preloader' )[ 0 ];

//////  CLASS API //////////
class ArtApi {
    static fetch() {
        return fetch( BASEURL, { method: 'get' } ).then( ( res ) => {
            return res.json();
        } );

        // add catch err
    }
    static remove( id ) {
        return fetch( `delete/${id}`, { method: 'delete' } )
            .then( ( res ) => {
                if ( !res.ok ) {
                    return alert( res.statusText );
                }
                return res.json();
            }
            );
    }
}

let articles = [];
const rendering = () => {
    const renderer = new RenderHTML();
    ArtApi.fetch().then( ( backendArticles ) => {
        articles = backendArticles.concat();
        articles.forEach( ( item, index ) => {
            const dataPost = renderer.getDataPost( item );
            renderer.getCategories( item );
            if ( renderer.randomPost === index ) {
                renderer.showRandomPost( item, dataPost );
            }
            if ( index < 3 ) {
                renderer.getSlider( item, dataPost );
                renderer.indexHtml.noPosts = '<div class="col-12 col-sm-6"><h2> No more posts </h2></div>';
            } else {
                renderer.indexHtml.noPosts = '';
                renderer.getCards( item, dataPost );
            }
        } );
        $featuredPost.innerHTML = renderer.indexHtml.featuredPost;
        $categories.innerHTML = renderer.indexHtml.categories;
        $posts.innerHTML = renderer.indexHtml.noPosts + renderer.indexHtml.cards;
        $preloader.style.display = 'none';
        $slider.innerHTML = renderer.indexHtml.slider;
        renderer.indexHtml.categories = '';
        renderer.indexHtml.cards = '';
        renderer.indexHtml.slider = '';
        renderer.Set = new Set();
    } )
        .then( () => {
            const script = document.createElement( 'script' );
            const body = $( 'body' )[ 0 ];
            script.type = 'text/javascript';
            script.src = '/public/js/staticHtml.js';
            body.appendChild( script );
            $( '.remove_post' ).click( function() {
                const isDelete = confirm( 'Are you sure want to delete this post?' );
                if ( isDelete ) {
                    const postId = $( this ).attr( 'data-id' );
                    $( this ).nextAll('#loader:first').css('display', 'flex');
                    ArtApi.remove( postId ).then( ( post ) => {
                        articles = articles.filter( ( item ) => {
                            if ( item._id !== post._id ) {
                                renderer.getCategories( item );
                            } else {
                                $( '.card-post' ).remove( `div[data-id='${postId}']` );
                                if ( articles.length <= 4 ) {
                                    $posts.innerHTML = '<div class="col-12 col-sm-6"><h2> No more posts </h2></div>';
                                }
                            }
                            return item._id !== post._id;
                        } );
                        $categories.innerHTML = renderer.indexHtml.categories;
                    } );
                }
                renderer.Set = new Set();
                renderer.indexHtml.categories = '';
            } );
        } );
};
rendering();
