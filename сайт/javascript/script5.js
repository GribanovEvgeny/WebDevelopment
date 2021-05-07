let prod;
LoadProdInBacket();
document.querySelector('.buttonToPay').onclick = ToBuy;

function LoadProdInBacket() {
    prod = JSON.parse(sessionStorage.getItem("productsInBasket"));
    let list = document.querySelector('#inBacket');
    list.innerHTML = '';    // очищаем список на сайте
    for (i in prod) {
        list.innerHTML += `
        <li data-order=${i}>
            <div class="inBacket_name">${prod[i].name}</div>
            <div class="inBacket_right">
                <div class="inBacket_price">Цена: ${prod[i].price} руб</div>
                <div class="inBacket_rightrow">
                    <div class="inBacket_minus">–</div>
                    <div class="inBacket_count">${prod[i].count}</div>
                    <div class="inBacket_plus">+</div>
                </div>
            </div>
        </li>`;
    }
    let minuses = document.querySelectorAll('.inBacket_minus');
    let pluses = document.querySelectorAll('.inBacket_plus');
    for (i in prod) {
        minuses[i].onclick = ReduceCount;
        pluses[i].onclick = IncreaseCount;
    }
    UpdateResult();
}

function UpdateResult() {
    let summa = 0;
    for (i in prod)
        summa += prod[i].count * prod[i].price;
    document.querySelector(".resultInBacket").innerHTML = `Итого: ${summa} руб`;
}

function ReduceCount() {
    let num = this.parentElement.parentElement.parentElement.getAttribute("data-order");
    prod[num].count -= 1;
    if (prod[num].count != 0)
        this.nextElementSibling.innerHTML = prod[num].count;
    else {
        this.parentElement.parentElement.parentElement.parentElement.removeChild(this.parentElement.parentElement.parentElement);
        prod.splice(num, 1);
        for (let i = 0; i < document.querySelector('#inBacket').children.length; i++) {
            document.querySelector('#inBacket').children[i].setAttribute('data-order', i);
        }
    }
    sessionStorage.setItem("productsInBasket", JSON.stringify(prod));
    if (sessionStorage.getItem("productsInBasket") == '[]')
        sessionStorage.removeItem("productsInBasket");
    UpdateResult();
}

function IncreaseCount() {
    let num = this.parentElement.parentElement.parentElement.getAttribute("data-order");
    prod[num].count += 1;
    this.previousElementSibling.innerHTML = prod[num].count;
    sessionStorage.setItem("productsInBasket", JSON.stringify(prod))
    UpdateResult();
}

let db;
let dbReq = indexedDB.open('db', 2);
dbReq.onupgradeneeded = (event) => {
    // Зададим переменной db ссылку на базу данных
    db = event.target.result;
    // Создадим хранилище объектов с именем notes.
    let notes = db.createObjectStore('orders', { autoIncrement: true });
}
dbReq.onsuccess = (event) => {
    db = event.target.result;

}
dbReq.onerror = (event) => {
    alert('error opening database ' + event.target.errorCode);
}

const addOrder = (db, date, city, JSON_order) => {
    let tx = db.transaction(['orders'], 'readwrite');   // Запустим транзакцию базы данных и получим хранилище объектов Orders
    let store = tx.objectStore('orders');
    let note = { date: date, city: city, JSON_order: JSON_order };    // Добаляем заметку в хранилище объектов
    store.add(note);
    tx.oncomplete = () => { // Ожидаем завершения транзакции базы данных
        console.log('stored note!')
    }
    tx.onerror = (event) => {
        alert('error storing note ' + event.target.errorCode);
    }
}

function ToBuy() {
    if (sessionStorage.getItem("productsInBasket") != null) {
        addOrder(db, new Date(), document.cookie.valueOf('country').replace('country=', ''), sessionStorage.getItem("productsInBasket"));

        sessionStorage.removeItem("productsInBasket");
        document.querySelector('#inBacket').innerHTML = '';
        prod = "";
        UpdateResult();
    }
    else
        alert('Корзина пустая!');
}