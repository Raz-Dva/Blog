$(document).ready(function () {
    $categories = $("#block-tags")[0];
    ///////////////////
    fetch("/articles", { method: "get" })
        .then((res) => {
            return res.json();
        })
        .then((data) => {
            if (data.length > 0) {
                let render = new RenderHTML();
                data.forEach((item) => {
                    render.getCategories(item);
                });
                $categories.innerHTML = indexHtml.categories;
            } else {
                $categories.innerHTML = "<h3>No categories</h3>";
            }
        });
}); // end $ready