const { db_get, db_getAll, db_run } = require('./database_operations');

const LIMIT = 30;

const getAllProducts = async (req, res, next) => {
	try {
		req.offset = req.query.page ? (+req.query.page - 1) * LIMIT : 0;

		if (req.query.filter_category) {
			const filteredProducts = await db_getAll(
				`SELECT products.id, COUNT(products.id) as items, products.name, products.description, GROUP_CONCAT(categories.category_name, ", ") as category FROM products LEFT JOIN product_groups ON products.id = product_groups.product_id LEFT JOIN categories ON product_groups.category_id = categories.id WHERE categories.category_name = "${req
					.query
					.filter_category}" GROUP BY products.id, products.name, products.description ORDER BY products.id 
					LIMIT ${LIMIT}
					OFFSET ${req.offset}`
			);

			req.totalProducts = filteredProducts.items;
			req.hasNextPage = LIMIT * (+req.query.page ? +req.query.page : 1) < req.totalProducts;
			req.hasPrevPage = req.query.page ? +req.query.page > 1 : false;
			req.nextPage = req.query.page ? +req.query.page + 1 : 2;
			req.prevPage = req.query.page ? +req.query.page - 1 : 1;
			req.lastPage = Math.ceil(req.totalProducts / LIMIT);

			const categories = await db_getAll('SELECT * FROM categories');
			req.products = filteredProducts;
			req.categories = categories;
			next();
		} else {
			req.offset = req.query.page ? (+req.query.page - 1) * LIMIT : 0;

			const productsWithCategs = await db_getAll(
				`SELECT
							products.id,
							products.name,
							products.description,
							GROUP_CONCAT(categories.category_name, ", ") as category
				FROM products
				LEFT JOIN product_groups
				ON products.id = product_groups.product_id
				LEFT JOIN categories
				ON product_groups.category_id = categories.id
				GROUP BY products.id, products.name, products.description
				ORDER BY products.id 
				LIMIT ${LIMIT}
				OFFSET ${req.offset}`
			);

			const itemsCount = await db_get('SELECT COUNT(*) as items FROM products');

			req.totalProducts = itemsCount.items;
			req.hasNextPage = LIMIT * (+req.query.page ? +req.query.page : 1) < req.totalProducts;
			req.hasPrevPage = req.query.page ? +req.query.page > 1 : false;
			req.nextPage = req.query.page ? +req.query.page + 1 : 2;
			req.prevPage = req.query.page ? +req.query.page - 1 : 1;
			req.lastPage = Math.ceil(req.totalProducts / LIMIT);

			const categories = await db_getAll('SELECT * FROM categories');

			req.products = productsWithCategs;
			req.categories = categories;

			next();
		}
	} catch (err) {
		console.error(err);
	}
};

const createNewProduct = async (req, res, next) => {
	try {
		const { product_name, product_cat, product_desc } = req.body;

		await db_run(`INSERT INTO products(name, description) VALUES ("${product_name}", "${product_desc}")`);

		const productId = await db_get(`SELECT id FROM products WHERE name = "${product_name}"`);

		if (product_cat instanceof Object) {
			product_cat.forEach(async (category) => {
				let categId = await db_get(`SELECT id FROM categories WHERE category_name = "${category}"`);
				await db_run(
					`INSERT INTO product_groups (category_id, product_id) VALUES (${+categId.id}, ${productId.id})`
				);
			});
		} else {
			let categId = await db_get(`SELECT id FROM categories WHERE category_name = "${product_cat}"`);
			await db_run(
				`INSERT INTO product_groups (category_id, product_id) VALUES (${+categId.id}, ${productId.id})`
			);
		}

		await db_run(`INSERT INTO inventory(product_id, stock) VALUES (${productId.id}, 0)`);
		next();
	} catch (err) {
		console.error(err);
	}
};

const modifyProduct = async (req, res, next) => {
	try {
		const itemId = req.params.id;
		const { product_name, product_cat, product_desc } = req.body;

		console.log('req.body', req.body);

		if (product_name && product_cat) {
			await db_run(
				`UPDATE products SET name = "${product_name}", description = "${product_desc}" WHERE id = ${+itemId}`
			);

			await db_run(`DELETE FROM product_groups WHERE product_id = ${+itemId}`);

			if (typeof product_cat === 'object') {
				for (const category of product_cat) {
					const categId = await db_get(`SELECT id FROM categories WHERE category_name ="${category}"`);
					await db_run(
						`INSERT INTO product_groups (category_id, product_id) VALUES (${categId.id}, ${+itemId})`
					);
				}

				next();
			} else {
				const categoryID = await db_get(`SELECT id FROM categories WHERE category_name = "${product_cat}"`);

				console.log('product_cat', product_cat);
				console.log('categoryID', categoryID);
				await db_run(
					`INSERT INTO product_groups (category_id, product_id) VALUES (${categoryID.id}, ${+itemId})`
				);
				next();
			}
		}
	} catch (err) {
		console.error(err);
	}
};

const deleteProduct = async (req, res, next) => {
	try {
		const delId = req.params.id;
		await db_run(`DELETE FROM products WHERE id = ${delId}`);
		await db_run(`DELETE FROM inventory WHERE product_id = ${delId}`);
		next();
	} catch (err) {
		console.error(err);
	}
};

module.exports = { getAllProducts, modifyProduct, deleteProduct, createNewProduct };
