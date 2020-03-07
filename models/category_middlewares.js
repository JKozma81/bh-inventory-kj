const { db_getAll, db_run, db_get } = require('./database_operations');

const LIMIT = 30;

const getAlldata = async (req, res, next) => {
	try {
		req.offset = req.query.page ? (+req.query.page - 1) * LIMIT : 0;

		let orderingBy;

		if (Object.keys(req.query).length === 0 && req.query.orderby) {
			if (req.query.orderby === 'id') orderingBy = 'main_cat_id';
			if (req.query.orderby === 'category_name') orderingBy = 'main_cat_name';
		} else {
			orderingBy = 'main_cat_id';
		}


		const mainsWithSubs = await db_getAll(`
		SELECT maincategory.id AS main_cat_id,
		maincategory.category_name AS main_cat_name,
		GROUP_CONCAT(subcategory.category_name, ", ") AS subcategories
		FROM categories AS maincategory
		LEFT JOIN categories AS subcategory
		ON maincategory.id = subcategory.parent_id
		WHERE maincategory.parent_id IS NULL
		GROUP BY maincategory.id
		ORDER BY ${Object.keys(req.query).length === 0 ? 'main_cat_id' : orderingBy} ${Object.keys(req.query).length === 0
				? 'ASC'
				: req.query.order}
		LIMIT ${LIMIT}
		OFFSET ${req.offset}`);

		const categoryHierarchy = await db_getAll('select maincategory.id as main_cat_id, maincategory.category_name as main_cat_name, subcategory.id as sub_cat_id, subcategory.category_name as subcategory from categories as maincategory left join categories as subcategory on maincategory.id = subcategory.parent_id where maincategory.parent_id is null');

		const categoriyCount = await db_get('SELECT COUNT(id) AS items FROM categories where parent_id is null');

		req.totalCategories = categoriyCount.items;
		req.limit = LIMIT;

		req.mainCategories = mainsWithSubs;
		req.categoryHierarchy = categoryHierarchy;

		next();
	} catch (err) {
		console.error(err);
	}
};

const newCategory = async (req, res, next) => {
	try {
		const { categ_name, categoryRole, mainCategoryName } = req.body;

		if (categoryRole === 'mainCategory') {
			await db_run(`INSERT INTO categories(category_name) VALUES ("${categ_name}")`);
		} else {
			const mainCatId = await db_get(`SELECT id FROM categories WHERE category_name = "${mainCategoryName}"`);
			await db_run(`INSERT INTO categories(category_name, parent_id) VALUES ("${categ_name}", ${mainCatId.id})`);
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

const deleteSubCategory = async (req, res, next) => {
	try {

		const { deleted_categs } = req.body;

		if (deleted_categs instanceof Object) {
			for (const category of deleted_categs) {
				const categoryId = await db_get(`SELECT id FROM categories WHERE category_name = "${category}"`)
				await db_run(`DELETE FROM product_categories WHERE category_id = ${categoryId.id}`);
				await db_run(`DELETE FROM categories WHERE category_name = "${category}"`);
			}
		} else {
			const categoryId = await db_get(`SELECT id FROM categories WHERE category_name = "${deleted_categs}"`)
			await db_run(`DELETE FROM product_categories WHERE category_id = ${categoryId.id}`);
			await db_run(`DELETE FROM categories WHERE category_name = "${deleted_categs}"`);
		}

		next();
	} catch (err) {
		console.error(err);
	}
}

module.exports = { getAlldata, newCategory, modifyCategory, deleteCategory, deleteSubCategory };
