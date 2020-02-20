const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('inventory.db')

db.serialize(function () {
    db.run("CREATE TABLE IF NOT EXISTS products (name VARCHAR(100), category VARCHAR(60))");

    db.run("INSERT INTO products VALUES ('Vezeték nélküli egér', 'Számítástechnika')");
    db.run("INSERT INTO products VALUES  ('Winchester', 'Számítástechnika')");
    db.run("INSERT INTO products VALUES  ('Elektromos radiátor', 'Fűtéstechnika')");
    db.run("INSERT INTO products VALUES  ('Gaba monitor', 'Számítástechnika')");
});

// db.close();