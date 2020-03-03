const { db_get, db_getAll, db_run } = require('./database_operations');

const LIMIT = 30;

const getAllProducts = async (req, res, next) => {
	try {
		req.limit = LIMIT;

		req.offset = req.query.page ? (+req.query.page - 1) * LIMIT : 0;

		let orderingBy;

		if (req.query.orderby) {
			if (req.query.orderby === 'id') orderingBy = 'products.id';
			if (req.query.orderby === 'category') orderingBy = 'category';
			if (req.query.orderby === 'name' || req.query.orderby === 'description')
				orderingBy = 'products.' + req.query.orderby;
		} else {
			orderingBy = 'products.id';
		}

		const coreSQLQuery = `
		SELECT
				products.id,
				products.name,
				products.description,
		GROUP_CONCAT(categories.category_name, ", ") as category
		FROM products
		LEFT JOIN product_categories
		ON products.id = product_categories.product_id
		LEFT JOIN categories
		ON product_categories.category_id = categories.id
	`;

		const sqlFooter = `
		GROUP BY products.id,
						 products.name,
							products.description
		ORDER BY ${orderingBy} ${!req.query.order ? 'ASC' : req.query.order} 
		LIMIT ${LIMIT}
		OFFSET ${req.offset}
	`;

		const filterSQL = `
	WHERE 
		categories.category_name = "${req.query.filter_category}"
		OR
		categories.category_name
		IN 
		(SELECT
				subcategory.category_name
			FROM
				categories
			LEFT JOIN categories AS subcategory
			ON
				categories.id = subcategory.parent_id
			WHERE
				categories.category_name = "${req.query.filter_category}")
	`;

		let itemCount, productsWithCategs;

		if (!req.query.filter_category) {
			const sqlQuery = coreSQLQuery + sqlFooter;
			itemCount = await db_get('SELECT COUNT(id) as items FROM products');
			productsWithCategs = await db_getAll(sqlQuery);
		} else {
			const sqlQuery = coreSQLQuery + filterSQL + sqlFooter;
			productsWithCategs = await db_getAll(sqlQuery);
			itemCount = db_get(`SELECT COUNT(*) as items FROM (${sqlQuery})`);
		}

		req.totalProducts = itemCount.items;

		const categories = await db_getAll('SELECT id, category_name FROM categories');
		req.products = productsWithCategs;
		req.categories = categories;
		next();
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
			for (const category of product_cat) {
				let categoryId = await db_get(`SELECT id FROM categories WHERE category_name = "${category}"`);
				await db_run(
					`INSERT INTO product_categories (category_id, product_id) VALUES (${+categoryId.id}, ${productId.id})`
				);
			}
		} else {
			let categId = await db_get(`SELECT id FROM categories WHERE category_name = "${product_cat}"`);
			await db_run(
				`INSERT INTO product_categories (category_id, product_id) VALUES (${+categId.id}, ${productId.id})`
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

		if (product_name && product_cat) {
			await db_run(
				`UPDATE products SET name = "${product_name}", description = "${product_desc}" WHERE id = ${+itemId}`
			);

			await db_run(`DELETE FROM product_categories WHERE product_id = ${+itemId}`);

			if (typeof product_cat === 'object') {
				for (const category of product_cat) {
					const categId = await db_get(`SELECT id FROM categories WHERE category_name ="${category}"`);
					await db_run(
						`INSERT INTO product_categories (category_id, product_id) VALUES (${categId.id}, ${+itemId})`
					);
				}

				next();
			} else {
				const categoryID = await db_get(`SELECT id FROM categories WHERE category_name = "${product_cat}"`);

				await db_run(
					`INSERT INTO product_categories (category_id, product_id) VALUES (${categoryID.id}, ${+itemId})`
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
