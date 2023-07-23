$( document ).ready( () => {

    window.addEventListener( 'pageshow', function() {
        localStorage.setItem( 'fromUrl', window.location.pathname );
    } );

    fetch( '/public/templates/footer.html', { method: 'get' } )
        .then( ( res ) => {
            return res.text();
        } )
        .then( ( data ) => {
            $( '#footer' )[ 0 ].innerHTML = data;
            let script = document.createElement( 'script' );
            let body = $( 'body' )[ 0 ];
            script.type = 'text/javascript';
            script.src = '/public/js/active.js';
            body.appendChild( script );
        } );

    fetch( '/public/templates/header.html', { method: 'get' } )
        .then( ( res ) => {
            return res.text();
        } )
        .then( ( data ) => {
            $( '#header' )[ 0 ].innerHTML = data;
        } );
} );
