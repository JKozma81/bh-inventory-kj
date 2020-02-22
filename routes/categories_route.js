const router = require('express').Router();
const sqlite3 = require('sqlite3').verbose();

const db = new sqlite3.Database('inventory.db');

router.get('/', (req, res) => {

    db.serialize(function () {
        db.all("SELECT * from categories", (err, results) => {
            if (err != null) {
                console.error(err.toString());
            }
            res.render('categories', {
                title: 'Csoportok',
                layout: 'groups',
                products: false,
                stocks: false,
                groups: true,
                items: results
            });
        });
    });
})

router.post('/', (req, res) => {
    const { categ_name } = req.body;

    db.serialize(() => {
        db.run(`INSERT INTO categories(category_name) VALUES ("${categ_name}")`, (err) => {
            if (err != null) {
                console.error(err.toString());
            }
        })
    })

    res.redirect('/categories');
})

router.post('/:id', (req, res) => {
    const catId = req.params.id;
    const { categ_name } = req.body;
    db.serialize(function () {

        if (catId) {
            db.run(`UPDATE categories SET category_name = "${categ_name}" WHERE id = ${+catId}`, (err) => {
                if (err != null) {
                    console.error(err.toString())
                }
            })
        }
    })

    res.redirect('/categories');
})

router.post('/del/:id', (req, res) => {
    const delId = req.params.id;

    db.serialize(function () {
        if (delId) {
            db.run(`UPDATE categories SET category_name = "${categ_name}" WHERE id = ${+catId}`, (err) => {
                if (err != null) {
                    console.error(err.toString())
                }
            })
        }
    })
    res.redirect('/categories');
})

module.exports = router;