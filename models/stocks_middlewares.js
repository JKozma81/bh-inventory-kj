const { db_getAll, db_run } = require('./database_operations');

const getStockQuantity = async (req, res, next) => {
    try {
        const stockPile = await db_getAll(
            'SELECT products.id, products.name, inventory.stock FROM products JOIN inventory ON products.id = inventory.product_id'
        );
        req.stockData = stockPile;
        next();
    }
    catch (err) { console.error(err) }
}

const modifyStockQty = async (req, res, next) => {
    try {
        const stockItemID = req.params.id;
        const { stock_quantity } = req.body;
        await db_run(`UPDATE inventory SET stock = ${+stock_quantity} WHERE product_id = ${+stockItemID}`);
        next();
    }
    catch (err) { console.error(err) }
}


module.exports = { getStockQuantity, modifyStockQty }
