const { db_getAll, db_run } = require('./database_operations');

const getAlldata = async (req, res, next) => {
    try {
        const data = await db_getAll('SELECT * from categories');
        req.data = data;
        next();
    }
    catch (err) { console.error(err) }
}

const newCategory = async (req, res, next) => {
    try {
        const { categ_name } = req.body;
        await db_run(`INSERT INTO categories(category_name) VALUES ("${categ_name}")`);
        next();
    }
    catch (err) { console.error(err) }
}

const modifyCategory = async (req, res, next) => {
    try {
        const catId = req.params.id;
        const { categ_name } = req.body;

        if (typeof +catId === 'number') {
            await db_run(`UPDATE categories SET category_name = "${categ_name}" WHERE id = ${+catId}`)
            next();
        }
    }
    catch (err) { console.error(err) }
}

const deleteCategory = async (req, res, next) => {
    try {
        const delId = req.params.id;
        await db_run(`DELETE FROM categories WHERE id = ${delId}`);
        await db_run(`DELETE FROM product_groups WHERE category_id = ${delId}`)
        next();
    }
    catch (err) { console.error(err) }
}

module.exports = { getAlldata, newCategory, modifyCategory, deleteCategory }