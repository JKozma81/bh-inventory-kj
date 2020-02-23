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

			console.log('homepage', prods);

			const refinedData = prods.map((prod) => {
				return {
					id: prod.id,
					name: prod.name,
					description: prod.description,
					category: prod.category ? prod.category : 'n/a'
				};
			});

			res.render('home', {
				title: 'Termékek',
				products: true,
				stocks: false,
				groups: false,
				items: refinedData,
				categories: categs
			});
		})
		.catch((err) => console.error(err));
});

router.post('/', (req, res) => {
	const { product_name, product_cat, product_desc } = req.body;

	const categIDs = [];

	if (product_name && product_cat) {
		const insertProd = db_run(
			`INSERT INTO products(name, description) VALUES ("${product_name}", "${product_desc}")`
		);
		const prodId = db_get(`SELECT id FROM products WHERE name = "${product_name}"`);

		if (product_cat instanceof Object) {
			product_cat.forEach((category) => {
				categIDs.push(db_get(`SELECT id FROM categories WHERE category_name = "${category}"`));
			});
		} else {
			categIDs.push(db_get(`SELECT id FROM categories WHERE category_name = "${product_cat}"`));
		}

		Promise.all([ prodId, ...categIDs ]).then((data) => {
			const [ productId, ...categoryIDs ] = data;

			Promise.all([
				db_run(`INSERT INTO inventory(product_id, stock) VALUES (${productId.id}, 0)`),
				categoryIDs.forEach((catId) => {
					db_run(
						`INSERT INTO product_groups (category_id, product_id) VALUES (${+catId.id}, ${productId.id})`
					);
				})
			])
				.then(() => {
					res.redirect('/products');
				})
				.catch((err) => console.error(err));
		});
	}
});

router.post('/:id', (req, res) => {
	const itemId = req.params.id;
	const { product_name, product_cat, product_desc } = req.body;

	if (product_name && product_cat) {
		const categID = db_get(`SELECT id FROM categories WHERE category_name ="${product_cat}"`);

		categID
			.then((categoryID) => {
				console.log(categoryID);
				db_run(
					`UPDATE products SET name = "${product_name}", description = "${product_desc}" WHERE id = ${+itemId}`
				).catch((err) => console.error(err));

				const categs = db_get(`SELECT * FROM product_groups WHERE product_id = ${+itemId}`);

				categs.then((data) => {
					if (data)
						return db_run(
							`UPDATE product_groups SET category_id = "${data.id}" WHERE product_id = ${+itemId}`
						);

					return db_run(
						`INSERT INTO product_groups (category_id, product_id) VALUES (${categoryID.id}, ${+itemId})`
					);
				});
			})
			.then(() => {
				res.redirect('/products');
			})
			.catch((err) => console.error(err));
	}
});

router.post('/del/:id', (req, res) => {
	const delId = req.params.id;

	Promise.all([
		db_run(`DELETE FROM products WHERE id = ${delId}`),
		db_run(`DELETE FROM inventory WHERE product_id = ${delId}`)
	])
		.then(() => {
			res.redirect('/products');
		})
		.catch((err) => console.error(err));
});

module.exports = router;
