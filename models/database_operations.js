const sqlite3 = require('sqlite3').verbose();

const db = new sqlite3.Database('inventory.db');

function db_getAll(sqlQuery) {
	return new Promise((resolve, reject) => {
		db.serialize(() => {
			db.all(sqlQuery, (err, results) => {
				if (err !== null) reject(err);
				resolve(results);
			});
		});
	});
}

function db_get(sqlQuery) {
	return new Promise((resolve, reject) => {
		db.serialize(() => {
			db.get(sqlQuery, (err, result) => {
				if (err !== null) reject(err);
				resolve(result);
			});
		});
	});
}

function db_run(sqlQuery) {
	return new Promise((resolve, reject) => {
		db.serialize(() => {
			db.run(sqlQuery, (err) => {
				if (err !== null) reject(err);
				resolve();
			});
		});
	});
}

module.exports = { db_get, db_getAll, db_run };
