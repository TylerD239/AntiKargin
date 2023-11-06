const dateformat = require('dateformat');
const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('db');

const suspiciousChars = [162, 165, 192,193,194,195,196,197,198,199,217,218,219,220,221,224,225,226,227,228,229,231,251,252,255];

class WordsFilter {
    check(string, callback) {
        if (!string) {
            return;
        }
        const string2 = this.prepareString(string);
        db.all("SELECT word FROM words", (error, rows) => {
            if (error) {
                console.error(error);
                return;
            }
            const haveKWord = rows.some(data => string2.includes(data.word.toLowerCase()));
            if (haveKWord || this.haveSuspiciousChars(string)) {
                console.log(`Сообщение ${string} удалено`);
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

    haveSuspiciousChars(str) {
        str = str.replace(/[\uD800-\uDBFF][\uDC00-\uDFFF]/g,'')
        for (let i = 0; i < str.length; i++) {
            const charCode = str.charCodeAt(i);
            if (suspiciousChars.includes(charCode) || ( charCode > 255 && charCode < 1040)  || charCode > 1105) {
                console.log(`Запрещенный символ ${str[i]}, код: ${charCode}`)
                return true;
            }
        }
        return false;
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

    isRussiaChar(code) {
        return code >= 1040 && code <= 1103;
    }

    isEnglChar(code) {
        return code >= 65 && code <= 122;
    }

}

module.exports = new WordsFilter();




