const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('db');

const initialWords = ['купат', 'кyпат', 'куп@т', 'kупат', 'kyпат', 'полиров', 'бутыл'];

db.serialize(() => {
    db.run("CREATE TABLE words (word TEXT)");
    db.run(`INSERT INTO words(word) VALUES ${initialWords.map(_=>('(?)'))}`,
        initialWords,
        function(error){
            if (error) {
                return console.error(error);
            }
            console.log("table words filled");
        }
    );
    db.run("CREATE TABLE deletedMessages (text TEXT, timestamp TIMESTAMP)");
});

db.close();
