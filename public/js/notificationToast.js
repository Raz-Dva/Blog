export default class Toast {
    alertHTML = '<div class="alert alert-notification mb-1" role="alert"></div>';
    success = 'alert-success';
    danger = 'alert-danger';

    showNotification(
        alertClass,
        text,
        fadeInTime = 200,
        fadeOutTime = 400,
        timeOut = 3000
    ) {
        const wrapperAlert = document.querySelector('.wrapper-alert');

        wrapperAlert.insertAdjacentHTML('afterbegin', this.alertHTML);
        const alertElement = document.querySelector('.alert-notification');
        alertElement.classList.add(this[alertClass]);
        alertElement.textContent = text;
        $(alertElement).fadeIn(fadeInTime);
        setTimeout(() => $(alertElement).fadeOut(fadeOutTime), timeOut);

        return this;
    }
}
