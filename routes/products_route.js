const router = require('express').Router();
const sqlite3 = require('sqlite3').verbose();

const db = new sqlite3.Database('inventory.db');

router.get('/', (req, res) => {
    db.serialize(function () {
        db.all("SELECT id, name, category_id, description from products", (err, products) => {
            if (err != null) {
                console.error(err.toString());
            }

            db.all("SELECT * FROM categories", (err, categs) => {
                if (err != null) {
                    console.error(err.toString());
                }

                const result = products.map(product => {
                    return {
                        id: product.id,
                        name: product.name,
                        description: product.description,
                        category: categs.find(categ => categ.id === product.category_id).category_name
                    }
                })

                res.render('home', {
                    title: 'Termékek',
                    products: true,
                    stocks: false,
                    groups: false,
                    items: result,
                    categories: categs
                })
            })
        });
    });
})


router.post('/', (req, res) => {
    const { product_name, product_cat, product_desc } = req.body;

    if (product_name && product_cat) {
        db.serialize(function () {

            db.get(`SELECT id FROM categories WHERE category_name = "${product_cat}"`, (err, catId) => {
                if (err != null) {
                    console.error(err.toString())
                }

                db.run(`INSERT INTO products(name, category_id, description) VALUES ("${product_name}", ${+catId.id}, "${product_desc}")`, (err) => {
                    if (err != null) {
                        console.error(err.toString())
                    }
                });

                db.get(`SELECT id FROM products WHERE name = "${product_name}"`, (err, result) => {
                    if (err != null) {
                        console.error(err.toString())
                    }

                    db.run(`INSERT INTO inventory(product_id, stock) VALUES (${result.id}, 0)`, (err) => {
                        if (err != null) {
                            console.error(err.toString())
                        }
                    })


                    db.run(`INSERT INTO product_groups (category_id, product_id) VALUES (${+catId.id}, ${result.id})`, (err) => {
                        if (err != null) {
                            console.error(err.toString())
                        }
                        res.redirect('/products');
                    })
                })
            })
        })
    }
})

router.post('/:id', (req, res) => {
    const itemId = req.params.id;

    const { product_name, product_cat } = req.body;
    db.serialize(function () {

        if (product_name && product_cat) {
            db.get(`SELECT id FROM categories WHERE category_name ="${product_cat}"`, (err, catId) => {
                if (err != null) {
                    console.error(err.toString())
                }

                db.run(`UPDATE products SET name = "${product_name}", category_id = ${+catId.id} WHERE id = ${+itemId}`, (err) => {
                    if (err != null) {
                        console.error(err.toString())
                    }
                })
            })
        }
    })

    res.redirect('/products');
})

router.post('/del/:id', (req, res) => {
    const delId = req.params.id;
    db.serialize(function () {
        db.run(`DELETE FROM products WHERE id = ${delId}`, (err) => {
            if (err != null) {
                console.error(err.toString())
            }
        })
        db.run(`DELETE FROM inventory WHERE product_id = ${delId}`, (err) => {
            if (err != null) {
                console.error(err.toString())
            }
        })
    })
    res.redirect('/products');
})

module.exports = router;