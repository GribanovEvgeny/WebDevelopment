let products;   // список продуктов в нужном порядке
LoadJSON();     // загружаем данные из JSON
document.querySelector('#comboSort').addEventListener("change", productsSort);      // добавить событие сортировки
document.querySelector('#comboFilter').addEventListener("change", productsFilter);  // добавить событие фильтрации

async function LoadJSON() { // загрузка JSON
    let response = await fetch('../products.json'); // получаем данные
    products = await response.json();       // преобразуем в JSON
    productsSort(); // сортируем
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

function productsSort() {   // сортировка
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

function productsFilter() { // фильтрация
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