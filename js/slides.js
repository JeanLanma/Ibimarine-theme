const slideMainThumbs = new Swiper('.thumbnails-row', {
    slidesPerView: 3,
    spaceBetween: 5,
    watchSlidesProgress: true,
})
const slideMain = new Swiper('.main_img', {
    spaceBetween: 10,
    navigation: {
        nextEl: '#arrowNext',
        prevEl: '#arrowPrev'
    },
    thumbs: {
            swiper: slideMainThumbs,
            },
})

const slideSimilarBoats = new Swiper('.swiper-similar-boats' , {
    width: 110,
    spaceBetween: 10,
    centeredSlidesBounds: true
})