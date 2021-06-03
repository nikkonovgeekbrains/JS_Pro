// const goods = [
//     { title: 'Shirt', price: 150 },
//     { title: 'Socks', price: 50 },
//     { title: 'Jacket', price: 350 },
//     { title: 'Shoes', price: 250 },
// ];

const API_URL = 'https://raw.githubusercontent.com/GeekBrainsTutorial/online-store-api/master/responses';

const makeGETRequest = (url, callback) => {
    return new Promise((resolve, reject) => {
        var xhr;

        if (window.XMLHttpRequest) {
            xhr = new XMLHttpRequest();
        } else if (window.ActiveXObject) {
            xhr = new ActiveXObject("Microsoft.XMLHTTP");
        }

        xhr.onreadystatechange = function () {
            if (xhr.readyState === 4) {
                if (xhr.status === 200) {
                    callback(xhr.responseText);
                }
                else {
                    reject('Error');
                }
            }
        }

        xhr.open('GET', url, true);
        xhr.send();

    });
}
// function makeGETRequest(url, callback) {
//     var xhr;

//     if (window.XMLHttpRequest) {
//         xhr = new XMLHttpRequest();
//     } else if (window.ActiveXObject) {
//         xhr = new ActiveXObject("Microsoft.XMLHTTP");
//     }

//     xhr.onreadystatechange = function () {
//         if (xhr.readyState === 4) {
//             callback(xhr.responseText);
//         }
//     }

//     xhr.open('GET', url, true);
//     xhr.send();
// }

class GoodsItem {
    constructor(title, price, id_product) {
        this.product_name = title;
        this.price = price;
        this.id_product = id_product;
        this.count = 1;
        console.log('id:');
        console.log(this.id_product);
    }


    render() {
        console.log('cur_count');
        console.log(this.count);
        let product_data = JSON.stringify({ "price": this.price, "product_name": this.product_name, "id_product": this.id_product, "count": this.count });

        return `<div class='goods-item'><h3>${this.product_name}</h3><p>${this.price}</p> 
        <button id = add_product_${this.id_product} data-product = '${product_data}' class='add_to_basket-button' type='button'>Добавить в корзину</button> </div>`;
    }
}

class GoodsList {
    _basket = new Basket();

    constructor() {
        this.goods = [];
    }

    fetchGoods(cb) {
        makeGETRequest(`${API_URL}/catalogData.json`, (goods) => {
            this.goods = JSON.parse(goods);
            console.log('goods:');
            console.log(this.goods);
            //console.log(this.goods);
            cb();
        })
    }

    render() {
        let listHtml = '';
        console.log(this.goods);
        let temp_id = 1;
        this.goods.forEach(good => {
            const goodItem = new GoodsItem(good.product_name, good.price, good.id_product);
            //temp_id += temp_id + 1;
            listHtml += goodItem.render();
        });
        console.log(listHtml);
        document.querySelector('.goods-list').innerHTML = listHtml;
        this._basket.setAddListeners(this.goods);
    }


    procSumCost() {
        var sum_cost = 0;
        this.goods.forEach(good => {
            sum_cost += good.price;
        });
        return sum_cost;
    }
}


class BasketItem extends GoodsItem {
    constructor(title, price, id_product, count = 0) {
        super(title, price, id_product);
        this.count = count;
    }

    incItem() {
        this.count += 1;
    }

    decItem() {
        if (this.count > 0) {
            this.count -= 1;
        }
    }

    procSumCost() {
        return this.price * this.count;
    }

    render() {
        console.log('new_cnt');
        console.log(this.count);
        return `<div class="goods-item"><h3>${this.product_name}</h3><p>${this.price}</p> 
        <button id = del_product_${this.id_product} data-id = ${this.id_product} class='del_from_basket-button' type='button' >Удалить</button> <p>Кол-во</p> <p>${this.count}</p> </div>`;
    }
}


class Basket {
    constructor() {
        this.goods = [];
    }

    addNewItem({ target }) {
        console.log("newItem");
        console.log(JSON.parse(target.dataset.product));
        const newItem = JSON.parse(target.dataset.product);
        console.log(newItem);
        var fl = 1;
        this.goods.forEach(good => {
            console.log('good:');
            console.log(good)
            console.log(good.product_name);
            console.log(newItem.product_name);
            console.log('price:');
            console.log(good.price);

            if (good.product_name == newItem.product_name && good.price == newItem.price) {
                good.count += 1;
                console.log('cnt');
                console.log(good.count);
                fl = 0;
            }
        });
        console.log('add+');
        console.log(newItem);
        if (fl) {
            this.goods.push(newItem);
        }
        console.log(this.goods)
        this.render();
    }

    setAddListeners(list) {
        list.forEach((item) => {
            document.getElementById(`add_product_${item.id_product}`).addEventListener('click', (e) => this.addNewItem(e));
        })
    }

    setDeleteListeners() {
        console.log('this_item:');
        console.log(this.goods);
        this.goods.forEach((item) => {
            console.log('?????');
            console.log(`delete_product_${item.id_product}`);
            document.getElementById(`del_product_${item.id_product}`).addEventListener('click', (e) => this.deleteItem(e));
        })
    }

    render() {
        let item_list_html = "";
        this.goods.forEach(good => {
            const tmp1 = new BasketItem(good.product_name, good.price, good.id_product, good.count);
            console.log('!!!!!');
            console.log(tmp1.render());
            item_list_html += tmp1.render();
        })
        console.log('add_cart:');
        console.log(item_list_html);
        document.querySelector('.cart-list').innerHTML = item_list_html;
        this.setDeleteListeners();
    }


    deleteItem({ target }) {
        // list.forEach((item) => {
        //     const (id = null)
        // })



        const id = target.dataset.id;
        console.log('del_id:');
        console.log(String(id));
        this.goods = this.goods.filter((item) => String(item.id_product) !== String(id));
        this.render();
    }

    clear() {
        this.goods = [];
    }

    procSumCost() {
        var sum_cost = 0;
        this.goods.forEach(good => {
            sum_cost += good.procSumCost();
        });
        return sum_cost;
    }
}


// const item1 = new BasketItem('it1', 2000, 1);
// console.log(item1);
// item1.decItem();
// console.log(item1);
// item1.decItem();
// console.log(item1);
// item1.incItem();
// item1.incItem();
// item1.incItem();
// console.log(item1);

// const item2 = new BasketItem('it2', 1500, 2);
// const bask = new Basket();
// bask.addNewItem(item1);
// bask.addNewItem(item2);
// console.log(bask);
// const item3 = new BasketItem('it1', 2000, 4);
// bask.addNewItem(item3);
// console.log(bask);
// console.log(bask.procSumCost());

const list = new GoodsList();
list.fetchGoods(() => {
    list.render();
});