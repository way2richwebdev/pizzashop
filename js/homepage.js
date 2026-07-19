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

    const filterItems = document.querySelectorAll('.menu-filter__item');

    const filterItemClickHandler = (target) => {
        document.querySelector('.menu-filter__item.active').classList.remove('active');

        target.classList.add('active');
    };

    const menu = [
        {id: 1, preview: './assets/img/menu1.png', categories: ['Мясная', 'Грибы'], label: 'Итальянская', description: 'Лук, картофель, помидоры, грибы, сыр, оливки, мясо...', sizes: [{size: 22, price: 350}, {size: 28, price: 380}, {size: 33, price: 400}]},
        {id: 2, preview: './assets/img/menu2.png', categories: ['Морепродукты'], label: 'Венеция', description: 'Лук, картофель, помидоры, грибы, сыр, оливки, мясо...', sizes: [{size: 22, price: 300}, {size: 28, price: 410}]},
        {id: 3, preview: './assets/img/menu3.png', categories: ['Мясная'], label: 'Мясная', description: 'Лук, картофель, помидоры, грибы, сыр, оливки, мясо...', sizes: [{size: 22, price: 380}, {size: 28, price: 400}, {size: 33, price: 420}]},
        {id: 4, preview: './assets/img/menu4.png', categories: ['Вегетарианская'], label: 'Сырная', description: 'Лук, картофель, помидоры, грибы, сыр, оливки, мясо...', sizes: [{size: 33, price: 500}]},
    ];

    const parsedCategories = new Set(menu.map((item) => item.categories).flat());

    const filterParent = document.querySelector('.menu-filter');

    const generateFilter = () => {
        const content = [...parsedCategories].map((item) => {
            return `<div class="menu-filter__item" data-filter-value="${item}">${item}</div>`
        })

        filterParent.insertAdjacentHTML('beforeend', content.join(''))
    };

    if(parsedCategories && parsedCategories.size){
        generateFilter();
    }else{
        filterParent.innerHTML = '';
    };

    const middleIndex = Math.ceil(menu.length / 2);

    const firstPart = menu.slice(0, middleIndex);
    const secondPart = menu.slice(middleIndex); 

    const menuListFirst = document.querySelector('.menu-list.first-part');
    const menuListSecond = document.querySelector('.menu-list.second-part');

    const generateMenuList = (contentArr, node, filter = null) => {
        node.innerHTML = '';

        let filteredContent = contentArr;

        if(filter){
            filteredContent = contentArr.filter((item) => {
                return item.categories.includes(filter)
            })
        };

        const content = filteredContent.map((item) => {
            return `
            <li class="menu-list__item" data-id="${item.id}" itemscope itemprop="itemListElement" itemtype="http://schema.org/Product">
                <img itemprop="image" loading="lazy" src="${item.preview}" alt="${item.label}" width="160" height="157" class="menu-list__item__preview">
                <h2 itemprop="name" class="menu-list__item__label">${item.label}</h2>
                <meta itemprop="description" content="${item.description}">
                <p class="menu-list__item__descr">${item.description}</p>
                <div class="menu-list__item-sizes">
                ${
                    item.sizes.map((el, index) => {
                        return `<div class="menu-list__item-sizes__item${index === item.sizes.length - 1 ? ' active' : ''}" data-value="${el.size}">${el.size}</div>`
                    }).join('')
                }
                </div>
                <div class="menu-list__item-actions-wrapper" itemscope itemprop="offers" itemtype="http://schema.org/Offer">
                    <div class="menu-list__item__price" itemprop="price">${item.sizes[item.sizes.length - 1].price} ₽</div>
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

    const pickSize = (target) => {
        const parent = target.closest('.menu-list__item');

        parent.querySelector('.menu-list__item-sizes__item.active').classList.remove('active');

        target.classList.add('active');

        const sizeValue = +target.innerHTML;
        
        const priceNode = parent.querySelector('.menu-list__item__price');

        const menuItem = menu.filter((item) => item.id === +parent.dataset.id);
        const newPrice = menuItem[0].sizes.filter((item) => item.size === sizeValue)[0].price;

        const itemQuantity = +parent.querySelector('.menu-list__item-actions__item__value').innerHTML;

        priceNode.innerHTML = newPrice * itemQuantity + ' ₽';
    };  

    const changeQuantity = (target, value) => {
        const parent = target.closest('.menu-list__item');
        const quantityNode = parent.querySelector('.menu-list__item-actions__item__value');
        const priceNode = parent.querySelector('.menu-list__item__price');

        let quantity = +quantityNode.innerHTML;

        if(value === -1 && quantity === 1){
            return
        }

        quantity = quantity + value;

        quantityNode.innerHTML = quantity;

        const sizeValue = +parent.querySelector('.menu-list__item-sizes__item.active').innerHTML;

        const menuItem = menu.filter((item) => item.id === +parent.dataset.id);

        const currentPrice = menuItem[0].sizes.filter((item) => item.size === sizeValue)[0].price;

        priceNode.innerHTML = currentPrice * quantity + ' ₽';
    };

    window.addEventListener('click', ({target}) => {
        if(target.className === 'menu-filter__item'){
            filterItemClickHandler(target);

            generateMenuList(firstPart, menuListFirst, target.dataset.filterValue);
            generateMenuList(secondPart, menuListSecond, target.dataset.filterValue);
        };
        
        if (target.className === 'menu-list__item-sizes__item'){
            pickSize(target);
        };

        if (target.className === 'menu-list__item-actions__item increment'){
            changeQuantity(target, 1);
        };

        if (target.className === 'menu-list__item-actions__item decrement'){
            changeQuantity(target, -1);
        };
    });
});