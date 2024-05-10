import Swiper from 'swiper';
import { Pagination, A11y } from 'swiper/modules';


document.addEventListener('DOMContentLoaded', () => {
    //Menu
    const menuButton = document.querySelector('.js-menu-toggle');

    menuButton.onclick = function() {
        if(menuButton.classList.contains('menu__toggle--active')) {
            menuButton.classList.remove('menu__toggle--active');
            menuButton.setAttribute('aria-expended', 'false')
        } else {
            menuButton.classList.add('menu__toggle--active');
            menuButton.setAttribute('aria-expended', 'true')
        }
    }

    //Video
    const videoButton = document.querySelector('.js-video-play')
    videoButton.onclick = function () {
        const video = videoButton.parentElement;
        const videoIframe = video.querySelector('iframe');
        videoIframe.contentWindow.postMessage(JSON.stringify({ event: 'command', func: 'playVideo' }), '*');
        video.classList.add('is-active');
    }

    // TEstimonials
    const swiper = new Swiper('.js-testimonials-slider', {
        // configure Swiper to use modules
        modules: [Pagination, A11y],
        loop: true,
        speed: 600,
        autoHeight: true,
        spaceBetween: 20,
        slidesPerView: 1,
        ally: true,
        pagination: {
            el: '.testimonials-slider__pagination',
            bulletElement: 'button',
            bulletClass: 'testimonials-slider__pagination-bullet',
            bulletActiveClass: 'testimonials-slider__pagination-bullet--active',
            clickable: true
        },
        breakpoints: {
            769: {
                slidesPerView: 'auto',
                centeredSlides: true,
                spaceBetween: 0,
                slideToClickedSlide: true,
            }
        }
    });
})