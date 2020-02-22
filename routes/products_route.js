const router = require('express').Router();
const { db_get, db_getAll, db_run } = require('../models/database_operations');

router.get('/', (req, res) => {
	const productsWithCategs = db_getAll(
		'SELECT products.id, products.name, products.description, categories.category_name as category FROM products LEFT JOIN product_groups ON products.id = product_groups.product_id LEFT JOIN categories ON product_groups.category_id = categories.id'
	);
	const categories = db_getAll('SELECT * FROM categories');

	Promise.all([ productsWithCategs, categories ])
		.then((data) => {
			const [ prods, categs ] = data;

			res.render('home', {
				title: 'Termékek',
				products: true,
				stocks: false,
				groups: false,
				items: prods,
				categories: categs
			});
		})
		.catch((err) => console.error(err));
});

router.post('/', (req, res) => {
	const { product_name, product_cat, product_desc } = req.body;
	if (product_name && product_cat) {
		const insertProd = db_run(
			`INSERT INTO products(name, description) VALUES ("${product_name}", "${product_desc}")`
		);
		const prodId = db_get(`SELECT id FROM products WHERE name = "${product_name}"`);

		Promise.all([ prodId, insertProd ])
			.then((data) => {
				const productID = data[0];

				db_run(`INSERT INTO inventory(product_id, stock) VALUES (${productID.id}, 0)`);

				db_get(`SELECT id FROM categories WHERE category_name = "${product_cat}"`)
					.then((catId) => {
						return db_run(
							`INSERT INTO product_groups (category_id, product_id) VALUES (${catId.id}, ${productID.id})`
						);
					})
					.then(() => {
						res.redirect('/products');
					});
			})
			.catch((err) => console.error(err));
	}
});

router.post('/:id', (req, res) => {
	const itemId = req.params.id;

	const { product_name, product_cat } = req.body;
	db.serialize(function() {
		if (product_name && product_cat) {
			db.get(`SELECT id FROM categories WHERE category_name ="${product_cat}"`, (err, catId) => {
				if (err != null) {
					console.error(err.toString());
				}

				db.run(
					`UPDATE products SET name = "${product_name}", category_id = ${+catId.id} WHERE id = ${+itemId}`,
					(err) => {
						if (err != null) {
							console.error(err.toString());
						}
					}
				);
			});
		}
	});

	res.redirect('/products');
});

router.post('/del/:id', (req, res) => {
	const delId = req.params.id;

	const deleteProd = db_run(`DELETE FROM products WHERE id = ${delId}`);
	const deleteInventory = db_run(`DELETE FROM inventory WHERE product_id = ${delId}`);

	Promise.all([ deleteProd, deleteInventory ])
		.then(() => {
			res.redirect('/products');
		})
		.catch((err) => console.error(err));
});

module.exports = router;
