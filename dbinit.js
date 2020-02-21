const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('inventory.db')

db.serialize(function () {
    db.run("CREATE TABLE IF NOT EXISTS products (id INTEGER PRIMARY KEY AUTOINCREMENT, name VARCHAR(100) NOT NULL, category VARCHAR(60) NOT NULL)");

    db.run("INSERT INTO products(name, category) VALUES ('Vezeték nélküli egér', 'Számítástechnika')");
    db.run("INSERT INTO products(name, category) VALUES  ('Winchester', 'Számítástechnika')");
    db.run("INSERT INTO products(name, category) VALUES  ('Elektromos radiátor', 'Fűtéstechnika')");
    db.run("INSERT INTO products(name, category) VALUES  ('Gaba monitor', 'Számítástechnika')");

    db.run("CREATE TABLE IF NOT EXISTS inventory (id INTEGER PRIMARY KEY, product_id INTEGER NOT NULL, stock INTEGER NOT NULL, FOREIGN KEY (product_id) REFERENCES products (id))");

    db.run("INSERT INTO inventory(product_id, stock) VALUES (1, 18)");
    db.run("INSERT INTO inventory(product_id, stock) VALUES (2, 13)");
    db.run("INSERT INTO inventory(product_id, stock) VALUES (3, 4)");
    db.run("INSERT INTO inventory(product_id, stock) VALUES (4, 2)");
});

// db.close();