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
			subcategory.id as sub_cat_id,
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

		const categoryHierarchy = await db_getAll(`
			SELECT maincategory.id AS main_cat_id,
			maincategory.category_name AS main_cat_name,
			subcategory.id AS sub_cat_id,
			subcategory.category_name AS subcategory
			FROM categories AS maincategory
			LEFT JOIN categories AS subcategory
			ON maincategory.id = subcategory.parent_id
			WHERE maincategory.parent_id IS NULL`);

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

		console.log(req.body)
		/*
		mainCatId: '1',
		main_category_name: 'Számítástechnika',
		subcategory_id: [ '12', '13' ],
		subcategory_name: [ 'Alaplapok', 'Perifériák' ],
		subcategorys_main_category: [ 'Számítástechnika', 'Számítástechnika' ],
		change_to_main: [ '12 true', '13 true' ]
		*/

		if (typeof +catId === 'number' && categ_name) {
			await db_run(`UPDATE categories SET category_name = "${categ_name}" WHERE id = ${+catId}`);
		} else if (typeof +catId === 'number') {
			const {
				main_catId,
				main_category_name,
				subcategory_id,
				subcategory_name,
				subcategorys_main_category,
				change_to_main } = req.body;

			await db_run(`UPDATE categories SET category_name = "${main_category_name}" WHERE id = ${+main_catId}`);

			if (typeof subcategory_id === 'object' && typeof subcategory_name === 'object' && typeof subcategorys_main_category === 'object') {
				for (const [idx, subcategoryId] of subcategory_id.entries()) {
					await db_run(`UPDATE categories SET category_name = "${subcategory_name[idx]}" WHERE id = ${+subcategoryId}`);
					const newParentId = await db_get(`SELECT id FROM categories WHERE category_name = "${subcategorys_main_category[idx]}"`)
					await db_run(`UPDATE categories SET parent_id = ${newParentId.id} WHERE id = ${+subcategoryId}`);
				}
			} else {
				await db_run(`UPDATE categories SET category_name = "${subcategory_name}" WHERE id = ${+subcategory_id}`);
				const newParentId = await db_get(`SELECT id FROM categories WHERE category_name = "${subcategorys_main_category}"`)
				await db_run(`UPDATE categories SET parent_id = ${newParentId.id} WHERE id = ${+subcategory_id}`);
			}

			if (change_to_main && typeof change_to_main === 'object') {
				for (const categoryToChange of change_to_main) {
					const tempArray = categoryToChange.split(' ');
					await db_run(`UPDATE categories SET parent_id = NULL WHERE id = ${+tempArray[0]}`);
				}
			} else if (change_to_main && typeof change_to_main === 'string') {
				const tempArray = categoryToChange.split(' ');
				await db_run(`UPDATE categories SET parent_id = NULL WHERE id = ${+tempArray[0]}`)
			}
		}
		next();
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
