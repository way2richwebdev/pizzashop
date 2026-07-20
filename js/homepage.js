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

    let filterValue = null;

    const filterItems = document.querySelectorAll('.menu-filter__item');

    const filterItemClickHandler = (target) => {
        document.querySelector('.menu-filter__item.active').classList.remove('active');

        target.classList.add('active');

        filterValue = target.dataset.filterValue;
        console.log(filterValue)
    };

    const menu = [
        {id: 1, preview: './assets/img/menu1.png', categories: ['Мясная', 'Грибы'], label: 'Итальянская', description: 'Лук, картофель, помидоры, грибы, сыр, оливки, мясо...', quantity: 1, sizes: [{size: 22, price: 350}, {size: 28, price: 380}, {size: 33, price: 400, isActive: true}]},
        {id: 2, preview: './assets/img/menu2.png', categories: ['Морепродукты'], label: 'Венеция', description: 'Лук, картофель, помидоры, грибы, сыр, оливки, мясо...', quantity: 1, sizes: [{size: 22, price: 300}, {size: 28, price: 410, isActive: true}]},
        {id: 3, preview: './assets/img/menu3.png', categories: ['Мясная'], label: 'Мясная', description: 'Лук, картофель, помидоры, грибы, сыр, оливки, мясо...', quantity: 1, sizes: [{size: 22, price: 380}, {size: 28, price: 400}, {size: 33, price: 420, isActive: true}]},
        {id: 4, preview: './assets/img/menu4.png', categories: ['Вегетарианская'], label: 'Сырная', description: 'Лук, картофель, помидоры, грибы, сыр, оливки, мясо...', quantity: 1, sizes: [{size: 33, price: 500, isActive: true}]},
    ];
    
    const parsedCategories = new Set(menu.map((item) => item.categories).flat());

    const filterParent = document.querySelector('.menu-filter');

    const generateFilter = () => {
        const content = [...parsedCategories].map((item) => {
            return `<button class="menu-filter__item" data-filter-value="${item}">${item}</button>`
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
            <li class="menu-list__item" data-id="${item.id}" data-price="${item.sizes.find((item) => item.isActive).price * item.quantity}" itemscope itemprop="itemListElement" itemtype="http://schema.org/Product">
                <img itemprop="image" loading="lazy" src="${item.preview}" alt="${item.label}" width="160" height="157" class="menu-list__item__preview">
                <h2 itemprop="name" class="menu-list__item__label">${item.label}</h2>
                <meta itemprop="description" content="${item.description}">
                <p class="menu-list__item__descr">${item.description}</p>
                <div class="menu-list__item-sizes">
                ${
                    item.sizes.map((el, index) => {
                        return `<button class="menu-list__item-sizes__item${el.isActive ? ' active' : ''}" data-value="${el.size}">${el.size}</button>`
                    }).join('')
                }
                </div>
                <div class="menu-list__item-actions-wrapper" itemscope itemprop="offers" itemtype="http://schema.org/Offer">
                    <div class="menu-list__item__price" itemprop="price">${item.sizes.find((item) => item.isActive).price * item.quantity} ₽</div>
                    <meta itemprop="priceCurrency" content="RUB">
                    <meta itemprop="availability" content="http://schema.org/InStock" />
                    <div class="menu-list__item-actions">
                        <button class="menu-list__item-actions__item decrement">-</button>
                        <div class="menu-list__item-actions__item__value">${item.quantity}</div>
                        <button class="menu-list__item-actions__item increment">+</button>
                    </div>
                </div>
                <button class="menu-list__item__button button">В корзину</button>
            </li>
            `
        });

        node.insertAdjacentHTML('afterbegin', content.join(''))
    };

    generateMenuList(firstPart, menuListFirst, filterValue);
    generateMenuList(secondPart, menuListSecond, filterValue);

    const updateMenuLists = (id) => {
        if(firstPart.find((item) => item.id === id)){
            generateMenuList(firstPart, menuListFirst, filterValue);
            return console.log('first')
        }

        if(secondPart.find((item) => item.id === id)){
            generateMenuList(secondPart, menuListSecond, filterValue); 
            return console.log('sec')
        }
    }

    const pickSize = (target) => {
        const parent = target.closest('.menu-list__item');

        parent.querySelector('.menu-list__item-sizes__item.active').classList.remove('active');

        target.classList.add('active');

        const menuItemId = +parent.dataset.id;
        const menuItem = menu.find((item) => item.id === menuItemId);

        const sizeValue = +target.innerHTML;
        
        menuItem.sizes.find((item) => item.isActive === true).isActive = false;
        menuItem.sizes.find((item) => item.size === sizeValue).isActive = true;
        
        updateMenuLists(menuItemId);
    };  

    const changeQuantity = (target, value) => {
        const parent = target.closest('.menu-list__item');
        const quantityNode = parent.querySelector('.menu-list__item-actions__item__value');
        const priceNode = parent.querySelector('.menu-list__item__price');

        const menuItemId = +parent.dataset.id;
        const menuItem = menu.find((item) => item.id === menuItemId);

        let quantity = menuItem.quantity;

        if(value === -1 && quantity === 1){
            return
        }

        quantity = quantity + value;

        menu.find((item) => item.id === menuItemId).quantity = quantity;

        updateMenuLists(menuItemId);
    };

    const addToCart = (target) => {
        const parent = target.closest('.menu-list__item');

        const timeout = setTimeout(() => {
            target.innerHTML = 'В корзину';
            target.removeAttribute('disabled');
            parent.classList.remove('active')
        }, 800);

        target.innerHTML = 'Добавлено';
        target.setAttribute('disabled', true);
        parent.classList.add('active')

        const id = +parent.dataset.id;

        const menuItem = menu.find((item) => item.id === id);

        const activeSize = menuItem.sizes.find((item) => item.isActive);

        const order = {
            id: menuItem.id,
            name: menuItem.label,
            size: activeSize.size,
            quantity: menuItem.quantity,
            price: activeSize.price * menuItem.quantity
        };

        console.log(order);
    };

    window.addEventListener('click', ({target}) => {
        if(target.className === 'menu-filter__item'){
            filterItemClickHandler(target);

            generateMenuList(firstPart, menuListFirst, filterValue);
            generateMenuList(secondPart, menuListSecond, filterValue);
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

        if (target.className === 'menu-list__item__button button'){
            addToCart(target);
        };
    });
});