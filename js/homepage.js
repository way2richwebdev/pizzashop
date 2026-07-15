window.addEventListener('DOMContentLoaded', () => {
    new Swiper('.sales-list.responsive', {
    direction: 'horizontal',
    slidesPerView: 1,
    spaceBetween: 0,
    autoplay: true,
    loop: true,
    navigation: {
        nextEl: '.swiper-button-next',
        prevEl: '.swiper-button-prev',
    },
    });
});