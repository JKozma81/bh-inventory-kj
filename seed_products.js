const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('inventory.db');

const adjectives = [
    'sima',
    'vizes',
    'érdes',
    'édes',
    'csíkos',
    'pöttyös',
    'tollas',
    'zsák',
    'kék',
    'hullámos',
    'világos',
]

const pronouns = [
    'asztal',
    'szék',
    'lámpa',
    'kosár',
    'kulacs',
    'pohár',
    'memória',
    'kábel',
    'szalag',
    'kapcsoló',
    'párna',
]

db.serialize(function () {
    adjectives.forEach(adjective => {
        pronouns.forEach(pronoun => {
            db.run(`INSERT INTO products(name) VALUES ("${adjective} ${pronoun}")`)
        })
    })
})