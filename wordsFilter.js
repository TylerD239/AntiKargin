const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('db');

function check(string, callback) {
    string = prepareString(string);
    db.all("SELECT word FROM words", (error, rows) => {
        if (error) {
            console.error(error);
            return;
        }
        const badMessage = rows.some(data => string.includes(data.word));
        console.log(badMessage)
        if (badMessage) {
            callback();
        }
    });
}

function prepareString(string) {
    return string.replace(/[^a-zA-Zа-яА-Я]/g, '').toLowerCase();
}

module.exports = check;




