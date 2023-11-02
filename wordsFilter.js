const dateformat = require('dateformat');
const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('db');

class WordsFilter {
    check(string, callback) {
        if (!string) {
            return;
        }
        string = this.prepareString(string);
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

    show(callback) {
        db.all("SELECT word FROM words", (error, rows) => {
            if (error) {
                console.error(error);
                return;
            }
            callback(rows.map(row => row.word));
        });
    }

    add(word) {
        if (!word) {
            return;
        }
        console.log(`Добавляем слово ${word}`);
        db.run(`INSERT INTO words(word)
                VALUES (?)`,
            [word.toLowerCase()],
            function (error) {
                if (error) {
                    return console.error(error);
                }
                console.log(`word ${word} added`);
            }
        );
    }


    save(text) {
        if (!text) {
            return;
        }
        console.log(`Сохраняем сообщение ${text}`);
        db.run(`INSERT INTO deletedMessages(text, timestamp)
                VALUES (?, ?)`,
            [text, `${dateformat(new Date(Date.now()), 'yyyy-mm-dd HH:MM:ss')}`],
            function (error) {
                if (error) {
                    return console.error(error);
                }
                console.log(`message ${text} saved`);
            }
        );
    }

    prepareString(string) {
        let withoutSymbols = string.replace(/[^a-zA-Zа-яА-Я]/g, '').toLowerCase();
        let stringtwo = "";
        const re = /(\S)\1/g;
        while (stringtwo.length !== withoutSymbols.length) {
            stringtwo = withoutSymbols;
            withoutSymbols = stringtwo.replace(re, '');
        }

       return stringtwo;
    }

}

module.exports = new WordsFilter();




