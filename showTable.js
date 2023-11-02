const tableNumber = process.argv[2];
const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('db');

(function show() {
    db.all(`SELECT * FROM ${tableNumber === '1' ? 'words' : 'deletedMessages'}`, (error, rows) => {
        if (error) {
            console.error(error);
            return;
        }
        console.log(rows)
    });
})();
