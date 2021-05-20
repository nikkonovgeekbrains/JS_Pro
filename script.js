// const goods = [
//     { title: 'Shirt', price: 150 },
//     { title: 'Socks', price: 50 },
//     { title: 'Jacket', price: 350 },
//     { title: 'Shoes', price: 250 },
// ];

class GoodsItem {
    constructor(title, price) {
        this.title = title;
        this.price = price;
    }
    render() {
        return `<div class="goods-item"><h3>${this.title}</h3><p>${this.price}</p></div>`;
    }
}

class GoodsList {
    constructor() {
        this.goods = [];
    }
    fetchGoods() {
        this.goods = [
            { title: 'Shirt', price: 150 },
            { title: 'Socks', price: 50 },
            { title: 'Jacket', price: 350 },
            { title: 'Shoes', price: 250 },
        ];
    }
    procSumCost() {
        var sum_cost = 0;
        this.goods.forEach(good => {
            sum_cost += good.price;
        });
        return sum_cost;
    }

    render() {
        let listHtml = '';
        this.goods.forEach(good => {
            const goodItem = new GoodsItem(good.title, good.price);
            listHtml += goodItem.render();
        });
        document.querySelector('.goods-list').innerHTML = listHtml;
    }
}


class BasketItem extends GoodsItem {
    constructor(title, price, count) {
        super(title, price);
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
}


class Basket extends GoodsList {
    constructor() {
        super();
    }

    addNewItem(newItem) {
        var fl = 1;
        this.goods.forEach(good => {
            if (good.title == newItem.title && good.price == newItem.price) {
                good.count += newItem.count;
                fl = 0;
            }
        });
        if (fl) {
            this.goods.push(newItem);
        }
    }

    deleteItems() {

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


const item1 = new BasketItem('it1', 2000, 1);
console.log(item1);
item1.decItem();
console.log(item1);
item1.decItem();
console.log(item1);
item1.incItem();
item1.incItem();
item1.incItem();
console.log(item1);

const item2 = new BasketItem('it2', 1500, 2);
const bask = new Basket();
bask.addNewItem(item1);
bask.addNewItem(item2);
console.log(bask);
const item3 = new BasketItem('it1', 2000, 4);
bask.addNewItem(item3);
console.log(bask);
console.log(bask.procSumCost());

const list = new GoodsList();
list.fetchGoods();
console.log(list);
console.log(list.procSumCost());
list.render();