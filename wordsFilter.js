const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('db');

function check(string, callback) {
    if (!string) {
        return;
    }
    string = prepareString(string);
    db.all("SELECT word FROM words", (error, rows) => {
        if (error) {
            console.error(error);
            return;
        }
        const badMessage = rows.some(data => string.includes(data.word));
        if (badMessage) {
            callback();
        }
    });
}

function add(word) {
    if (!word) {
        return;
    }
    console.log(`Добавляем слово ${word}`);
    db.run(`INSERT INTO words(word) VALUES (?)`,
        [word],
        function(error){
            if (error) {
                return console.error(error);
            }
            console.log(`word ${word} added`);
        }
    );
}

function prepareString(string) {
    return string.replace(/[^a-zA-Zа-яА-Я]/g, '').toLowerCase();
}



module.exports.check = check;
module.exports.add = add;




