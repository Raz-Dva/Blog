import Toast from './notificationToast.js';

export default class APIMethods {
    static GET() {
        return fetch('/articles', {method: 'get'})
            .then((res) => {
                if (!res.ok) {
                    new Toast().showNotification('danger', `Error: ${res.statusText}`);
                    res.text().then((text) => {
                        new Toast().showNotification('danger', `Error: ${text}`)
                    })
                    return;
                }
                return res.json();
            })
            .catch((error) => {
                console.log(error)
            });
    }
    static DELETE(id) {
        return fetch(`delete/${id}`, {method: 'delete'})
            .then((res) => {
                if (!res.ok) {
                    new Toast().showNotification('danger', `Error: ${res.statusText}`);
                    res.text().then((text) => {
                        new Toast().showNotification('danger', `Error: ${text}`)
                    });
                    return;
                }
                return res.json();
            })
            .catch((error) => {
                console.log(error)
            });
    }
}
