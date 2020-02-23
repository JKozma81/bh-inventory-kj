const router = require('express').Router();
const { db_get, db_getAll, db_run } = require('../models/database_operations');

router.get('/', (req, res) => {
	const stockPile = db_getAll(
		'SELECT products.id, products.name, inventory.stock FROM products JOIN inventory ON products.id = inventory.product_id'
	);

	stockPile
		.then((data) => {
			res.render('home', {
				title: 'Készletek',
				layout: 'stock',
				products: false,
				stocks: true,
				categories: false,
				items: data
			});
		})
		.catch((err) => console.error(err));
});

router.post('/:id', (req, res) => {
	const stockItemID = req.params.id;
	const { stock_quantity } = req.body;

	db_run(`UPDATE inventory SET stock = ${+stock_quantity} WHERE product_id = ${+stockItemID}`).then(() => {
		res.redirect('/stocks');
	});
});

module.exports = router;
