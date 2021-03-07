let arrayBufferToBase64 = function (buffer) {
    if(buffer){let binary = "";
    let bytes = [].slice.call(new Uint8Array(buffer));
    bytes.forEach((b) => (binary += String.fromCharCode(b)));
    return window.btoa(binary);}
    else{
        console.log('Buffer is empty');
        return '';
    }

    
}