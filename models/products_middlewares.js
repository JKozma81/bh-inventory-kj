const { db_get, db_getAll, db_run } = require('./database_operations');

const getAllProducts = async (req, res, next) => {
    try {

        if (req.query.filter_category) {

            const filteredProducts = await db_getAll(
                `SELECT products.id, products.name, products.description, categories.category_name as category FROM products LEFT JOIN product_groups ON products.id = product_groups.product_id LEFT JOIN categories ON product_groups.category_id = categories.id WHERE categories.category_name = "${req.query.filter_category}"`
            );

            const categories = await db_getAll('SELECT * FROM categories');
            req.products = filteredProducts;
            req.categories = categories;
            next()

        } else {

            const productsWithCategs = await db_getAll(
                'SELECT products.id, products.name, products.description, categories.category_name as category FROM products LEFT JOIN product_groups ON products.id = product_groups.product_id LEFT JOIN categories ON product_groups.category_id = categories.id'
            );

            const categories = await db_getAll('SELECT * FROM categories');

            req.products = productsWithCategs;
            req.categories = categories;
            next()
        }


    }
    catch (err) { console.error(err) }
}

const createNewProduct = async (req, res, next) => {
    try {
        const { product_name, product_cat, product_desc } = req.body;

        await db_run(
            `INSERT INTO products(name, description) VALUES ("${product_name}", "${product_desc}")`
        )

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
    }
    catch (err) { console.error(err) }
}

const modifyProduct = async (req, res, next) => {
    try {
        const itemId = req.params.id;
        const { product_name, product_cat, product_desc } = req.body;

        if (product_name && product_cat) {
            const categoryID = await db_get(`SELECT id FROM categories WHERE category_name ="${product_cat}"`);
            await db_run(
                `UPDATE products SET name = "${product_name}", description = "${product_desc}" WHERE id = ${+itemId}`
            );

            const categs = await db_get(`SELECT * FROM product_groups WHERE product_id = ${+itemId}`);

            if (categs) {
                await db_run(
                    `UPDATE product_groups SET category_id = "${categoryID.id}" WHERE product_id = ${+itemId}`
                );
                next();
            } else {
                await db_run(
                    `INSERT INTO product_groups (category_id, product_id) VALUES (${categoryID.id}, ${+itemId})`
                );
            }
        }
        next();
    }
    catch (err) { console.error(err) }
}

const deleteProduct = async (req, res, next) => {
    try {
        const delId = req.params.id;

        await db_run(`DELETE FROM products WHERE id = ${delId}`);
        await db_run(`DELETE FROM inventory WHERE product_id = ${delId}`);
        next();
    }
    catch (err) { console.error(err) }
}

module.exports = { getAllProducts, modifyProduct, deleteProduct, createNewProduct }