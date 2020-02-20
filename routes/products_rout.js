const router = require('express').Router();
const sqlite3 = require('sqlite3').verbose();

const dummyCats = ['Számítástechnika', 'Konyhatechnika', 'Fűtéstechnika', 'Árnyékolástechnika'];

const db = new sqlite3.Database('inventory.db');

router.get('/', (req, res) => {
    db.serialize(function () {
        db.all("SELECT rowId as id, name, category from products", function (err, results) {
            if (err != null) {
                console.error(err.toString())
            }

            res.render('home', {
                title: 'Termékek',
                items: results,
                categories: dummyCats
            })

        });
    });
})

router.post('/', (req, res) => {
    const { product_name, product_cat } = req.body;
    db.serialize(function () {
        db.all(`InSERT INTO products VALUES ("${product_name}", "${product_cat}")`, function (err, results) {
            if (err != null) {
                console.error(err.toString())
            }
            res.redirect('/products');

        });
    })
})

module.exports = router;