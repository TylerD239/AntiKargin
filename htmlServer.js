const app = require('express')()
const port = 80;

app.get('/', function (req, res) {
    res.send('Здарова ебать');
})

app.listen(port, () => {
    console.log(`Ну, слушаю ${port}`);
});
