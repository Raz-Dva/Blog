import { footerFetch, headerFetch } from './staticHtml.js';
import getPosts from './getPosts.js'

const fetchHtml = [footerFetch, headerFetch];
const browserWindow = $(window);
const isMainPage = window.location.pathname === '/' || window.location.pathname === '/index.html';

if (isMainPage) {
    fetchHtml.push(getPosts())
}

Promise.all(fetchHtml)
    .then(() => {
        if (isMainPage) {
            activeMain();
        }
        active();
    })
    .catch((error) => {
        console.error(error);
    });

function activeMain() {
    // Preloader Active Code
    browserWindow.on('load', function() {
        $('.preloader').fadeOut('slow', function() {
            $(this).remove();
        });
    });

    // Sliders Active Code
    if ($.fn.owlCarousel) {
        const welcomeSlide = $('.hero-post-slides');

        welcomeSlide.owlCarousel({
            items: 1,
            margin: 0,
            loop: true,
            nav: true,
            navText: ['<i class="fa fa-angle-left"></i>', '<i class="fa fa-angle-right"></i>'],
            dots: true,
            autoplay: true,
            autoplayTimeout: 2000,
            smartSpeed: 500,
            animateIn: 'fadeIn',
            animateOut: 'fadeOut'
        });

        welcomeSlide.on('changed.owl.carousel', function(event) {
            if (!event.namespace || event.property.name !== 'position') {
                return;
            }
            $('.page-count').html(event.relatedTarget.relative(event.item.index) + 1 + '<span>' + '/' + event.item.count + '</span>');
        });

        welcomeSlide.on('translate.owl.carousel', function() {
            const slideLayer = $('[data-animation]');
            slideLayer.each(function() {
                const animName = $(this).data('animation');
                $(this).removeClass('animated ' + animName).css('opacity', '0');
            });
        });

        welcomeSlide.on('translated.owl.carousel', function() {
            const slideLayer = welcomeSlide.find('.owl-item.active').find('[data-animation]');
            slideLayer.each(function() {
                const animName = $(this).data('animation');
                $(this).addClass('animated ' + animName).css('opacity', '1');
            });
        });

        $('[data-delay]').each(function() {
            const animDel = $(this).data('delay');
            $(this).css('animation-delay', animDel);
        });

        $('[data-duration]').each(function() {
            const animDur = $(this).data('duration');
            $(this).css('animation-duration', animDur);
        });
    }
}

function active() {
    'use strict'

    // Nav Active Code
    if ($.fn.classyNav) {
        $('#nikkiNav').classyNav();
    }

    // ScrollUp Active Code
    if ($.fn.scrollUp) {
        browserWindow.scrollUp({
            scrollSpeed: 300,
            scrollText: '<i class="fa fa-angle-up"></i>'
        });
    }

    // Sticky Active Code
    if ($.fn.sticky) {
        $('.nikki-main-menu').sticky({
            topSpacing: 0
        });
    }

    //  prevent default a click
    $('a[href="#"]').on('click', function($) {
        $.preventDefault();
    });

    //  wow Active Code
    if (browserWindow.width() > 767) {
        // eslint-disable-next-line no-undef
        new WOW().init();
    }
}
