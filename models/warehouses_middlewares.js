const { db_getAll, db_run, db_get } = require('./database_operations');

const LIMIT = 30;

const getWarehouses = async (req, res, next) => {
	try {
		next();
	} catch (err) {
		console.error(err);
	}
};

const modifyWarehouse = async (req, res, next) => {
	try {
		next();
	} catch (err) {
		console.error(err);
	}
};

const deleteWarehouse = async (req, res, next) => {
	try {
		next();
	} catch (err) {
		console.error(err);
	}
};

module.exports = { getWarehouses, modifyWarehouse, deleteWarehouse };
