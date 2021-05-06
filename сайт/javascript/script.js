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
    ProductsSort(); // сортируем

    if (document.cookie.match("country") == undefined)  // проверяем, есть ли куки
        document.querySelector('#popupCountry').classList.remove("hidden"); // если нет, то показываем попап
    else
        document.querySelector('.popup_open').innerHTML = document.cookie.valueOf('country').replace('country=', '');   // иначе подгружаем город для вывода на страницу
}

function UpdateProducts() { // обновление списка товаров
    let list = document.querySelector('section ul');
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
        <a href="#">${products[i].price} руб</a>
        </li>`;
    }
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