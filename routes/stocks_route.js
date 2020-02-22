const router = require('express').Router();
const sqlite3 = require('sqlite3').verbose();

const db = new sqlite3.Database('inventory.db');

router.get('/', (req, res) => {
    db.serialize(function () {
        db.all("SELECT products.id, products.name, products.category, inventory.stock FROM products JOIN inventory ON products.id = inventory.product_id", function (err, results) {
            if (err != null) {
                console.error(err.toString())
            }

            res.render('home', {
                title: 'Készletek',
                layout: 'stock',
                products: false,
                stocks: true,
                categories: false,
                items: results
            });

        });
    });
})

router.post('/', (req, res) => {
    const { stock_quantity, stock_item_id } = req.body;
    db.serialize(function () {

        if (stock_item_id !== undefined && stock_quantity !== undefined) {
            db.run(`UPDATE inventory SET stock = ${+stock_quantity} WHERE product_id = ${+stock_item_id}`, (err) => {
                if (err != null) {
                    console.error(err.toString())
                }
            })
        }
    })

    res.redirect('/stocks');
})

module.exports = router;