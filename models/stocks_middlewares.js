const { db_getAll, db_run, db_get } = require('./database_operations');

const LIMIT = 30;

const getStockQuantity = async (req, res, next) => {
	try {
		req.offset = req.query.page ? (+req.query.page - 1) * LIMIT : 0;

		let orderingBy = ''
		if (req.query.orderby === 'id') orderingBy = 'inventory.id'
		if (req.query.orderby === 'name') orderingBy = 'products.name'
		if (req.query.orderby === 'stock') orderingBy = 'full_qty'

		let wareHouseId, stockItems, stockPile;

		const coreSqlQuery = `
		SELECT
			inventory.id,
			products.id,
			products.name,
			warehouses.id as wh_id,
		SUM(inventory.stock) as full_qty,
		GROUP_CONCAT(warehouses.name, ', ')
		AS
			warehouses
		FROM
			products
		JOIN
			inventory
		ON
			products.id = inventory.product_id
		JOIN
			warehouses
		ON
			inventory.warehouse_id = warehouses.id
		`;

		const sqlFooter = `
		GROUP BY 
			products.name, products.id
		ORDER BY ${req.query.orderby ? orderingBy : 'products.id'} ${Object.keys(req.query).length === 0 ? 'ASC' : req.query.order}
		LIMIT ${LIMIT}
		OFFSET ${req.offset}
		`;

		if (req.query.filter_wh) {
			wareHouseId = await db_get(`SELECT id FROM warehouses WHERE name = "${req.query.filter_wh}"`);

			const filterSql = `
			WHERE warehouses.id = ${wareHouseId.id}
			`;

			const sqlQuery = coreSqlQuery + filterSql + sqlFooter;

			stockPile = await db_getAll(sqlQuery);
			stockItems = await db_get(`SELECT COUNT(*) AS itemsInStock FROM (${coreSqlQuery + filterSql + 'GROUP BY products.name, products.id'})`);
		} else {
			const sqlQuery = coreSqlQuery + sqlFooter;

			stockPile = await db_getAll(sqlQuery);
			stockItems = await db_get(`SELECT COUNT(*) AS itemsInStock FROM (${coreSqlQuery + 'GROUP BY products.name, products.id'})`);
		}

		const wHouses = await db_getAll('SELECT id, name, address FROM warehouses');

		req.totalProducts = stockItems.itemsInStock;
		req.limit = LIMIT;
		req.wareHouses = wHouses;

		req.stockData = stockPile;
		next();
	} catch (err) {
		console.error(err);
	}
};

const modifyStockQty = async (req, res, next) => {
	try {
		const stockItemID = req.params.id;
		const { stock_quantity, warehouse_id } = req.body;
		await db_run(`UPDATE inventory SET stock = ${+stock_quantity} WHERE product_id = ${+stockItemID} AND warehouse_id = ${+warehouse_id}`);
		next();
	} catch (err) {
		console.error(err);
	}
};

module.exports = { getStockQuantity, modifyStockQty };
