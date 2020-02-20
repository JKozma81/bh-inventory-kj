const router = require('express').Router();
const sqlite3 = require('sqlite3').verbose();


router.get('/products', (req, res) => {
    const db = new sqlite3.Database('inventory.db')
    db.serialize(function () {
        db.all("SELECT rowId as id, name, category from products", function (err, results) {
            if (err != null) {
                console.error(err.toString())
            }

            res.render('home', {
                title: 'Termékek',
                items: results
            })

        });
    });
})


module.exports = router;