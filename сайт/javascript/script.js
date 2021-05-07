let products;   // список продуктов в нужном порядке
LoadPage();     // загружаем данные на страницу
document.querySelector('#comboSort').addEventListener("change", ProductsSort);      // добавить событие сортировки
document.querySelector('#comboFilter').addEventListener("change", ProductsFilter);  // добавить событие фильтрации

for (i in document.querySelectorAll('.inputCountry'))
    document.querySelectorAll('.inputCountry')[i].onclick = SetCountry; // добавить событие установки страны
document.querySelector('.popup_close').onclick = ClosePopup;
document.querySelector('.popup_open').onclick = OpenPopup;

async function LoadPage() { // загрузка JSON
    let response = await fetch('../products.json'); // получаем данные
    products = await response.json();       // преобразуем в JSON
    ProductsSort(); // сортируем не на бэкенде

    if (document.cookie.match("country") == undefined)  // проверяем, есть ли куки
        document.querySelector('#popupCountry').classList.remove("hidden"); // если нет, то показываем попап
    else
        document.querySelector('.popup_open').innerHTML = document.cookie.valueOf('country').replace('country=', '');   // иначе подгружаем город для вывода на страницу

    if (sessionStorage.getItem("productsInBasket") != null) {  // если страницу перезагружают, то проверяем, есть ли сессия
        let prod = JSON.parse(sessionStorage.getItem("productsInBasket"));
        let count_prod = 0;
        for (i in prod)
            count_prod += prod[i].count;
        document.querySelector('#basketCount p').innerHTML = count_prod;   // загружаем данные на страницу
        document.querySelector('#basketCount').classList.remove("hidden");  // показываем счетчик товаров
    }
}

function UpdateProducts() { // обновление списка товаров
    let list = document.querySelector('#inShop');
    list.innerHTML = '';    // очищаем список на сайте
    for (i in products) {
        let classesProd = products[i].classes[0];   // собираем классы в строку через пробел
        for (let j = 1; j < products[i].classes.length; j++)
            classesProd += ' ' + products[i].classes[j];
        list.innerHTML += `
        <li class="${classesProd}" data-price=${products[i].price}>
        <img src="${products[i].imageSrc}" alt="${products[i].imageAlt}">
        <h5>${products[i].name}</h5>
        <p>${products[i].description}
        </p>
        <p class="buttonBuy">${products[i].price} руб</p>
        </li>`;
    }
    for (i in document.querySelectorAll('.buttonBuy'))
        document.querySelectorAll('.buttonBuy')[i].onclick = AddProduct; // добавить событие добавления в корзину
}

function ProductsSort() {   // сортировка
    switch (document.querySelector('#comboSort').value) {
        case 'upPrice':
            for (let i = 0; i < products.length; i++)
                for (let j = i + 1; j < products.length; j++)
                    if (+products[i].price > +products[j].price)
                        [products[i], products[j]] = [products[j], products[i]];
            break;
        case 'downPrice':
            for (let i = 0; i < products.length; i++)
                for (let j = i + 1; j < products.length; j++)
                    if (+products[i].price < +products[j].price)
                        [products[i], products[j]] = [products[j], products[i]];
            break;
    }
    UpdateProducts();
}

function ProductsFilter() { // фильтрация
    if (document.querySelector('#comboFilter').value == 'all')
        for (let i = 0; i < products.length; i++) {
            if (products[i].classes.indexOf('hidden') != -1)
                products[i].classes.splice(products[i].classes.indexOf('hidden'), 1);
        }
    else
        for (let i = 0; i < products.length; i++) {
            if (products[i].classes.indexOf(document.querySelector('#comboFilter').value) == -1 && products[i].classes.indexOf('hidden') == -1)
                products[i].classes.push('hidden');
            else if (products[i].classes.indexOf(document.querySelector('#comboFilter').value) != -1 && products[i].classes.indexOf('hidden') != -1)
                products[i].classes.splice(products[i].classes.indexOf('hidden'), 1);
        }
    UpdateProducts();
}

//--------------------------------3лаба-----------------------------------

function SetCountry() { // занести выбранную страну в куки
    document.cookie = `country=${this.getAttribute('data-country')}`;   // заносим значение в куки
    document.querySelector('.popup_open').innerHTML = this.getAttribute('data-country');    // меняем город на странице
    ClosePopup();
}

function ClosePopup() { // закрыть попап
    document.querySelector('#popupCountry').classList.add("hidden");    // спрятать попап
    if (document.cookie.match("country") == undefined) {    // если город не был выбран, хардкодим москву
        document.cookie = `country=Москва`;
        document.querySelector('.popup_open').innerHTML = "Москва";
    }
}

function OpenPopup() {  // открыть попап
    document.querySelector('#popupCountry').classList.remove("hidden");
}

//--------------------------------4лаба-----------------------------------

function AddProduct() { // добавление продукта в корзину
    if (sessionStorage.getItem("productsInBasket") == null) {
        let prod = [
            {
                name: this.parentElement.children[1].innerText,
                price: this.parentElement.getAttribute('data-price'),
                count: 1
            }
        ]
        sessionStorage.setItem("productsInBasket", JSON.stringify(prod))
        document.querySelector('#basketCount p').innerHTML = 1;
        document.querySelector('#basketCount').classList.remove("hidden");
    }
    else {
        let prod = JSON.parse(sessionStorage.getItem("productsInBasket"));
        let not_found = true;
        for (let i = 0; i < prod.length && not_found; i++)
            if (prod[i].name == this.parentElement.children[1].innerText) {
                prod[i].count += 1;
                not_found = false;
            }
        if (not_found)
            prod.push({
                name: this.parentElement.children[1].innerText,
                price: this.parentElement.getAttribute('data-price'),
                count: 1
            })
        sessionStorage.setItem("productsInBasket", JSON.stringify(prod))
        let count_prod = 0;
        for (i in prod)
            count_prod += prod[i].count;
        document.querySelector('#basketCount p').innerHTML = count_prod;
        document.querySelector('#basketCount').classList.remove("hidden");
    }
}