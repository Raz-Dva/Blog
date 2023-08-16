window.addEventListener('pageshow', function() {
    localStorage.setItem('fromUrl', window.location.pathname);
});

const footerFetch = fetch('/public/templates/footer.html', { method: 'get' })
    .then((res) => res.text())
    .then((data) => $('#footer')[0].innerHTML = data)

const headerFetch = fetch('/public/templates/header.html', { method: 'get' })
    .then((res) => res.text())
    .then((data) => $('#header')[0].innerHTML = data)

export { footerFetch, headerFetch };
