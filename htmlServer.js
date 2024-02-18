const express = require('express');
const app = express();
const port = 80;
const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('db');

app.get('/', function (req, res) {
    console.log(req.hostname);
    res.sendFile(__dirname + "/index.html");
})

app.listen(port, () => {
    console.log(`Ну, слушаю ${port}`);
});

app.get('/test', async (req, res) => {
    db.all(`SELECT * FROM messages`, (error, rows) => {
        if (error) {
            console.error(error);
            return;
        }
        res.send(rows);
    });
});

