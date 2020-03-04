const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('inventory.db');

db.serialize(function () {
	//Termékek tábla
	db.run(
		'CREATE TABLE IF NOT EXISTS products (id INTEGER PRIMARY KEY AUTOINCREMENT, name VARCHAR(100) NOT NULL, description TEXT)'
	);

	//Raktárak
	db.run(
		'CREATE TABLE IF NOT EXISTS warehouses (id INTEGER PRIMARY KEY AUTOINCREMENT, name VARCHAR(100) NOT NULL, address TEXT NOT NULL)'
	);

	//Készletek tábla
	db.run(
		'CREATE TABLE IF NOT EXISTS inventory (id INTEGER PRIMARY KEY, product_id INTEGER NOT NULL, stock INTEGER NOT NULL, warehouse_id INTEGER NOT NULL, FOREIGN KEY (product_id) REFERENCES products (id), FOREIGN KEY (warehouse_id) REFERENCES warehouses (id))'
	);

	//Kategóriák tábla
	db.run('CREATE TABLE IF NOT EXISTS categories (id INTEGER PRIMARY KEY, category_name VARCHAR(60) NOT NULL, parent_id INTEGER, FOREIGN KEY (parent_id) REFERENCES categories (id))');

	//Termék kategóriák kapcsoló tábla
	db.run(
		'CREATE TABLE IF NOT EXISTS product_categories (id INTEGER PRIMARY KEY, category_id INTEGER NOT NULL, product_id INTEGER NOT NULL, FOREIGN KEY (category_id) REFERENCES categories (id), FOREIGN KEY (product_id) REFERENCES products (id))'
	);


	//Termékek

	/*
	db.run(
		"INSERT INTO products(name, description) VALUES ('Vezeték nélküli egér', 'A legjobb megoldás abban az esetben, ha idegesít a vezeték.')"
	);
	db.run("INSERT INTO products(name, description) VALUES  ('Winchester', 'Adattárolásra legmegfelelőbb megoldás.')");
	db.run(
		"INSERT INTO products(name, description) VALUES  ('Elektromos radiátor', 'Fűtés korszerűsítésére a legalkalmasabb eszköz.')"
	);
	db.run("INSERT INTO products(name, description) VALUES  ('Gaba monitor', '27 colos kijelzőjével a gamerek álma.')");
	db.run(
		"INSERT INTO products(name, description) VALUES  ('LG monitor', '24 colos kijelzőjével a irodistáknak megfelelő.')"
	);
	*/

	//Raktárak
	db.run('INSERT INTO warehouses(name, address) VALUES ("Private Store", "Hungary, 6320, Solt, Bocskay u. 8.")');
	db.run('INSERT INTO warehouses(name, address) VALUES ("Központi Gyűjtő", "Hungary, 2053, Herceghalom, Zsámbéki u. 14.")');

	//Készletek
	/*
	db.run('INSERT INTO inventory(product_id, stock, warehouse_id) VALUES (1, 18, 1)');
	db.run('INSERT INTO inventory(product_id, stock, warehouse_id) VALUES (1, 6, 2)');
	db.run('INSERT INTO inventory(product_id, stock, warehouse_id) VALUES (2, 13, 1)');
	db.run('INSERT INTO inventory(product_id, stock, warehouse_id) VALUES (2, 3, 2)');
	db.run('INSERT INTO inventory(product_id, stock, warehouse_id) VALUES (3, 4, 1)');
	db.run('INSERT INTO inventory(product_id, stock, warehouse_id) VALUES (4, 2, 2)');
	db.run('INSERT INTO inventory(product_id, stock, warehouse_id) VALUES (5, 4, 2)');
	*/

	//Kategóriák
	db.run("INSERT INTO categories(category_name, parent_id) VALUES ('Számítástechnika', null)");
	db.run("INSERT INTO categories(category_name, parent_id) VALUES ('Alaplapok', 1)");
	db.run("INSERT INTO categories(category_name, parent_id) VALUES ('Perifériák', 1)");
	db.run("INSERT INTO categories(category_name, parent_id) VALUES ('Okos otthon', null)");
	db.run("INSERT INTO categories(category_name, parent_id) VALUES ('Okos kapcsolók', 4)");
	db.run("INSERT INTO categories(category_name, parent_id) VALUES ('Okos mérőeszközök', 4)");
	db.run("INSERT INTO categories(category_name, parent_id) VALUES ('Mobil telefon', null)");
	db.run("INSERT INTO categories(category_name, parent_id) VALUES ('Telefon tokok', 7)");
	db.run("INSERT INTO categories(category_name, parent_id) VALUES ('EKönyv', null)");

	//Kategória hozzárendelések
	db.run('INSERT INTO product_categories(category_id, product_id) VALUES (1, 1)');
	db.run('INSERT INTO product_categories(category_id, product_id) VALUES (1, 2)');
	db.run('INSERT INTO product_categories(category_id, product_id) VALUES (2, 3)');
	db.run('INSERT INTO product_categories(category_id, product_id) VALUES (1, 4)');
});

// db.close();
