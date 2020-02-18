const express = require('express');
const path = require('path');
const hbs = require('express-handlebars');

const PORT = 3000;
const app = express();
app.engine('handlebars', hbs());
app.set('view engine', 'handlebars');

app.use(express.static(path.join(__dirname, 'public')));

app.get('/', (req, res) => {
    res.render('home');
})


app.listen(PORT, () => console.log(`App is started and listening on port ${PORT}`))