export const validImgPost = ( input, img, hint, btn ) => {
    const validateImage = () => {
        const formData = new FormData();
        const file = input[ 0 ].files[ 0 ];
        formData.append( 'Filedata', file );
        const t = file.type.split( '/' ).pop().toLowerCase();
        if (
            t !== 'jpeg' &&
            t !== 'jpg' &&
            t !== 'png' &&
            t !== 'bmp' &&
            t !== 'gif'
        ) {
            hint
                .removeClass( 'd-none' )
                .html( 'Please select a valid image file' );
            btn.attr( 'disabled', true );

            input[ 0 ].value = '';
            img[ 0 ].src = '';
            return false;
        }
        if ( file.size > 1024000 ) {
            hint.removeClass( 'd-none' ).html( 'Max Upload size is 1MB only' );
            btn.attr( 'disabled', true );
            input[ 0 ].value = '';
            img[ 0 ].src = '';
            return false;
        }
        return true;
    };

    input.change( function( evt ) {
        if ( validateImage() ) {
            hint.addClass( 'd-none' );
            btn.attr( 'disabled', false );
            evt.stopPropagation();
            evt.preventDefault();

            const files = evt.target.files;
            const file = files[ 0 ];
            const fileReader = new FileReader();

            fileReader.onload = function() {
                img[ 0 ].src = fileReader.result;
            };
            fileReader.readAsDataURL( file ); // fileReader.result -> URL.
        }
    } );

};
