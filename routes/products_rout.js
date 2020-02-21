const router = require('express').Router();
const sqlite3 = require('sqlite3').verbose();

const dummyCats = ['Számítástechnika', 'Konyhatechnika', 'Fűtéstechnika', 'Árnyékolástechnika'];

const db = new sqlite3.Database('inventory.db');

router.get('/', (req, res) => {
    db.serialize(function () {
        db.all("SELECT id, name, category from products", (err, results) => {
            if (err != null) {
                console.error(err.toString());
            }

            res.render('home', {
                title: 'Termékek',
                products: true,
                stocks: false,
                groups: false,
                items: results,
                categories: dummyCats
            })

        });
    });
})

router.post('/', (req, res) => {
    const { product_name, product_cat } = req.body;

    if (product_name && product_cat) {
        db.serialize(function () {
            db.run(`INSERT INTO products(name, category) VALUES ("${product_name}", "${product_cat}")`, (err) => {
                if (err != null) {
                    console.error(err.toString())
                }
            });

            db.get(`SELECT id FROM products WHERE name = "${product_name}" AND category = "${product_cat}"`, (err, result) => {
                if (err != null) {
                    console.error(err.toString())
                }

                db.run(`INSERT INTO inventory(product_id, stock) VALUES (${result.id}, 0)`, (err) => {
                    if (err != null) {
                        console.error(err.toString())
                    }
                })
                res.redirect('/products');
            })
        })
    }
})

module.exports = router;