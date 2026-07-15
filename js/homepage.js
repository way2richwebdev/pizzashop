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

    const menu = [
        {id: 1, preview: './assets/img/menu1.png', label: 'Итальянская', description: 'Лук, картофель, помидоры, грибы, сыр, оливки, мясо...', sizes: [22, 28, 33], price: 350},
        {id: 2, preview: './assets/img/menu2.png', label: 'Венеция', description: 'Лук, картофель, помидоры, грибы, сыр, оливки, мясо...', sizes: [22, 28, 33], price: 380},
        {id: 3, preview: './assets/img/menu3.png', label: 'Мясная', description: 'Лук, картофель, помидоры, грибы, сыр, оливки, мясо...', sizes: [22, 28, 33], price: 400},
        {id: 4, preview: './assets/img/menu4.png', label: 'Сырная', description: 'Лук, картофель, помидоры, грибы, сыр, оливки, мясо...', sizes: [22, 28, 33], price: 330},
    ];

    const middleIndex = Math.ceil(menu.length / 2);

    const firstPart = menu.slice(0, middleIndex);
    const secondPart = menu.slice(middleIndex); 

    const menuListFirst = document.querySelector('.menu-list.first-part');
    const menuListSecond = document.querySelector('.menu-list.second-part');

    const generateMenuList = (contentArr, node) => {
        const content = contentArr.map((item) => {
            return `
            <li class="menu-list__item" data-id="${item.id}" itemscope itemprop="itemListElement" itemtype="http://schema.org/Product">
                <img itemprop="image" loading="lazy" src="${item.preview}" alt="${item.label}" width="160" height="157" class="menu-list__item__preview">
                <h2 itemprop="name" class="menu-list__item__label">${item.label}</h2>
                <meta itemprop="description" content="${item.description}">
                <p class="menu-list__item__descr">${item.description}</p>
                <div class="menu-list__item-sizes">
                ${
                    item.sizes.map((size, index) => {
                        return `<div class="menu-list__item-sizes__item ${index === 1 || item.sizes.length === 1 ? 'active' : ''}" data-value="${size}">${size}</div>`
                    }).join('')
                }
                </div>
                <div class="menu-list__item-actions-wrapper" itemscope itemprop="offers" itemtype="http://schema.org/Offer">
                    <div class="menu-list__item__price" itemprop="price">${item.price} ₽</div>
                    <meta itemprop="priceCurrency" content="RUB">
                    <meta itemprop="availability" content="http://schema.org/InStock" />
                    <div class="menu-list__item-actions">
                        <div class="menu-list__item-actions__item decrement">-</div>
                        <div class="menu-list__item-actions__item__value">1</div>
                        <div class="menu-list__item-actions__item increment">+</div>
                    </div>
                </div>
                <button class="menu-list__item__button button">В корзину</button>
            </li>
            `
        });

        node.insertAdjacentHTML('afterbegin', content.join(''))
    };

    generateMenuList(firstPart, menuListFirst);
    generateMenuList(secondPart, menuListSecond);
});