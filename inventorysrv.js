const express = require('express');
const path = require('path');
const hbs = require('express-handlebars');

const productsRouter = require('./routes/products_rout');
const stocksRouter = require('./routes/stocks_rout');

const PORT = 3000;
const app = express();
app.engine('handlebars', hbs());
app.set('view engine', 'handlebars');
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));

app.use('/products', productsRouter);
app.use('/stocks', stocksRouter);

app.get('/', (req, res) => {
    res.redirect('/products')
})

app.listen(PORT, () => console.log(`App is started and listening on port ${PORT}`));
