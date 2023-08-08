import RenderHTML from '../../js/renderHtml.js';

const $categories = $( '#block-tags' )[ 0 ];
fetch( '/articles', { method: 'get' } )
    .then( ( res ) => {
        return res.json();
    } )
    .then( ( data ) => {
        if ( data.length > 0 ) {
            const renderer = new RenderHTML();
            data.forEach( ( item ) => {
                renderer.getCategories( item );
            } );
            $categories.innerHTML = renderer.indexHtml.categories;
        } else {
            $categories.innerHTML = '<h3>No categories</h3>';
        }
    } );
