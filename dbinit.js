const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('inventory.db');

db.serialize(function() {
	db.run(
		'CREATE TABLE IF NOT EXISTS products (id INTEGER PRIMARY KEY AUTOINCREMENT, name VARCHAR(100) NOT NULL, description TEXT NOT NULL)'
	);

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

	db.run(
		'CREATE TABLE IF NOT EXISTS inventory (id INTEGER PRIMARY KEY, product_id INTEGER NOT NULL, stock INTEGER NOT NULL, FOREIGN KEY (product_id) REFERENCES products (id))'
	);

	db.run('INSERT INTO inventory(product_id, stock) VALUES (1, 18)');
	db.run('INSERT INTO inventory(product_id, stock) VALUES (2, 13)');
	db.run('INSERT INTO inventory(product_id, stock) VALUES (3, 4)');
	db.run('INSERT INTO inventory(product_id, stock) VALUES (4, 2)');

	db.run('CREATE TABLE IF NOT EXISTS categories (id INTEGER PRIMARY KEY, category_name VARCHAR(60) NOT NULL)');

	db.run("INSERT INTO categories(category_name) VALUES ('Számítástechnika')");
	db.run("INSERT INTO categories(category_name) VALUES ('Okos otthon')");
	db.run("INSERT INTO categories(category_name) VALUES ('Mobil telefon')");
	db.run("INSERT INTO categories(category_name) VALUES ('EKönyv')");

	db.run(
		'CREATE TABLE IF NOT EXISTS product_groups (id INTEGER PRIMARY KEY, category_id INTEGER NOT NULL, product_id INTEGER NOT NULL, FOREIGN KEY (category_id) REFERENCES categories (id), FOREIGN KEY (product_id) REFERENCES products (id))'
	);

	db.run('INSERT INTO product_groups(category_id, product_id) VALUES (1, 1)');
	db.run('INSERT INTO product_groups(category_id, product_id) VALUES (1, 2)');
	db.run('INSERT INTO product_groups(category_id, product_id) VALUES (2, 3)');
	db.run('INSERT INTO product_groups(category_id, product_id) VALUES (1, 4)');
});

// db.close();
