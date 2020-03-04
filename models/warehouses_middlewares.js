const { db_getAll, db_run } = require('./database_operations');

const getWarehouses = async (req, res, next) => {
	try {
		const warehousesData = await db_getAll('SELECT id, name, address FROM warehouses');

		const whStockQty = [];
		for (const whData of warehousesData) {
			const whItemCount = await db_getAll(`SELECT warehouses.id, COUNT(product_id) as items FROM inventory JOIN warehouses ON inventory.warehouse_id = warehouses.id WHERE inventory.warehouse_id = ${whData.id}`);
			whStockQty.push(...whItemCount)
		}
		req.whData = warehousesData;
		req.stockQtyData = whStockQty;
		next();
	} catch (err) {
		console.error(err);
	}
};

const newWarehouse = async (req, res, next) => {
	try {
		const { warehouse_name, warehouse_country, warehouse_city, warehouse_zip, warehouse_street_and_hn } = req.body;

		await db_run(`INSERT
					  INTO warehouses(name, address)
					  VALUES ("${warehouse_name}", "${warehouse_country}, ${warehouse_zip}, ${warehouse_city}, ${warehouse_street_and_hn}")`);

		next();
	} catch (err) {
		console.error(err);
	}
};

const modifyWarehouse = async (req, res, next) => {
	try {
		const { warehouse_name, warehouse_country, warehouse_city, warehouse_zip, warehouse_street_and_hn } = req.body;
		const whID = req.params.id;

		await db_run(`UPDATE
						warehouses
					  SET
						name = "${warehouse_name}",
						address = "${warehouse_country}, ${warehouse_zip}, ${warehouse_city}, ${warehouse_street_and_hn}"
					  WHERE id = ${whID}`)
		next();
	} catch (err) {
		console.error(err);
	}
};

const deleteWarehouse = async (req, res, next) => {
	try {
		const delId = +req.params.id;
		await db_run(`DELETE FROM inventory WHERE warehouse_id = ${delId}`);
		await db_run(`DELETE FROM warehouses WHERE id = ${delId}`);
		next();
	} catch (err) {
		console.error(err);
	}
};

module.exports = { getWarehouses, modifyWarehouse, deleteWarehouse, newWarehouse };
