const { db_getAll, db_run, db_get } = require('./database_operations');

const LIMIT = 30;

const getStockQuantity = async (req, res, next) => {
	try {
		req.offset = req.query.page ? (+req.query.page - 1) * LIMIT : 0;

		let orderingBy = ''
		if (req.query.orderby === 'id') orderingBy = 'products.id'
		if (req.query.orderby === 'name') orderingBy = 'products.name'
		if (req.query.orderby === 'stock') orderingBy = 'inventory.stock'

		const stockPile = await db_getAll(
			`SELECT
        		products.id,
        		products.name,
        		inventory.stock
      		FROM products
      		JOIN inventory
			ON products.id = inventory.product_id
			ORDER BY ${req.query.orderby ? orderingBy : 'products.id'} ${Object.keys(req.query).length === 0 ? 'ASC' : req.query.order}
			LIMIT ${LIMIT}
			OFFSET ${req.offset}`
		);

		const stockItems = await db_get('SELECT COUNT(*) AS itemsInStock FROM inventory');

		req.totalProducts = stockItems.itemsInStock;
		req.limit = LIMIT;

		req.stockData = stockPile;
		next();
	} catch (err) {
		console.error(err);
	}
};

const modifyStockQty = async (req, res, next) => {
	try {
		const stockItemID = req.params.id;
		const { stock_quantity } = req.body;
		await db_run(`UPDATE inventory SET stock = ${+stock_quantity} WHERE product_id = ${+stockItemID}`);
		next();
	} catch (err) {
		console.error(err);
	}
};

module.exports = { getStockQuantity, modifyStockQty };
