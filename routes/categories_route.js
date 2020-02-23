const router = require('express').Router();
const { db_get, db_getAll, db_run } = require('../models/database_operations');

router.get('/', (req, res) => {
	db_getAll('SELECT * from categories')
		.then((data) => {
			res.render('categories', {
				title: 'Csoportok',
				layout: 'groups',
				products: false,
				stocks: false,
				groups: true,
				items: data
			});
		})
		.catch((err) => console.error(err));
});

router.post('/', (req, res) => {
	const { categ_name } = req.body;

	db_run(`INSERT INTO categories(category_name) VALUES ("${categ_name}")`)
		.then(() => {
			res.redirect('/categories');
		})
		.catch((err) => console.error(err));
});

router.post('/:id', (req, res) => {
	const catId = req.params.id;
	const { categ_name } = req.body;

	if (typeof +catId === 'number') {
		db_run(`UPDATE categories SET category_name = "${categ_name}" WHERE id = ${+catId}`)
			.then(() => {
				res.redirect('/categories');
			})
			.catch((err) => console.error(err));
	}
});

router.post('/del/:id', (req, res) => {
	const delId = req.params.id;

	Promise.all([
		db_run(`DELETE FROM categories WHERE id = ${delId}`),
		db_run(`DELETE FROM product_groups WHERE category_id = ${delId}`)
	]).then(() => {
		res.redirect('/categories');
	});
});

module.exports = router;
