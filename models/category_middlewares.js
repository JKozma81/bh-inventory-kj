const { db_getAll, db_run, db_get } = require('./database_operations');

const LIMIT = 30;

const getAlldata = async (req, res, next) => {
	try {
		req.offset = req.query.page ? (+req.query.page - 1) * LIMIT : 0;
		const data = await db_getAll(
			`SELECT
			id,
			category_name 
			FROM categories
			ORDER BY ${Object.keys(req.query).length === 0 ? 'id' : req.query.orderby} ${Object.keys(req.query).length === 0 ? 'ASC' : req.query.order}
			LIMIT ${LIMIT}
			OFFSET ${req.offset}`
		);

		const mainCategories = await db_getAll(`
			SELECT 
				id,
				category_name
			FROM categories
			WHERE parent_id IS NULL
			ORDER BY ${Object.keys(req.query).length === 0 ? 'id' : req.query.orderby} ${Object.keys(req.query).length === 0 ? 'ASC' : req.query.order}
			LIMIT ${LIMIT}
			OFFSET ${req.offset}
		`)

		const categoriyCount = db_get('SELECT COUNT(id) AS items FROM categories');

		req.totalProducts = categoriyCount.items;
		req.limit = LIMIT;

		req.mainCategories = mainCategories;
		req.data = data;
		next();
	} catch (err) {
		console.error(err);
	}
};

const newCategory = async (req, res, next) => {
	try {
		const { categ_name, categoryRole, mainCategoryName } = req.body;
		console.log(req.body)

		if (categoryRole === 'mainCategory') {
			const mainCatId = await db_get(`SELECT id FROM categories WHERE category_name = "${mainCategoryName}"`);
			await db_run(`INSERT INTO categories(category_name, parent_id) VALUES ("${categ_name}", ${mainCatId.id})`);
		} else {
			await db_run(`INSERT INTO categories(category_name) VALUES ("${categ_name}")`);
		}

		next();
	} catch (err) {
		console.error(err);
	}
};

const modifyCategory = async (req, res, next) => {
	try {
		const catId = req.params.id;
		const { categ_name } = req.body;

		if (typeof +catId === 'number') {
			await db_run(`UPDATE categories SET category_name = "${categ_name}" WHERE id = ${+catId}`);
			next();
		}
	} catch (err) {
		console.error(err);
	}
};

const deleteCategory = async (req, res, next) => {
	try {
		const delId = req.params.id;
		await db_run(`DELETE FROM product_categories WHERE category_id = ${delId}`);
		await db_run(`DELETE FROM categories WHERE id = ${delId}`);
		next();
	} catch (err) {
		console.error(err);
	}
};

module.exports = { getAlldata, newCategory, modifyCategory, deleteCategory };
