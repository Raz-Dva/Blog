export default class APIMethods {
    static GET() {
        return fetch('/articles', { method: 'get' })
            .then((res) => {
                if (!res.ok) {
                    alert(res.statusText);
                    res.text().then((errorText) => alert(errorText));
                    return;
                }
                return res.json();
            })
            .catch((error) => {
                console.log(error)
            });
    }
    static DELETE(id) {
        return fetch(`delete/${id}`, { method: 'delete' })
            .then((res) => {
                if (!res.ok) {
                    alert(res.statusText);
                    res.text().then((errorText) => alert(errorText));
                    return;
                }
                return res.json();
            })
            .catch((error) => {
                console.log(error)
            });
    }
}
