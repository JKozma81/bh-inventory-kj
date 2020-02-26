const express = require('express');
const path = require('path');
const hdbs = require('express-handlebars');

const productsRouter = require('./routes/products_route');
const stocksRouter = require('./routes/stocks_route');
const categoryRouter = require('./routes/categories_route');

const PORT = 3000;
const app = express();
app.engine(
	'handlebars',
	hdbs({
		helpers: require('./config/handlebars-helpers')
	})
);
app.set('view engine', 'handlebars');
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));

app.use('/products', productsRouter);
app.use('/stocks', stocksRouter);
app.use('/categories', categoryRouter);

app.get('/', (req, res) => {
	res.redirect('/products');
});

app.listen(PORT, () => console.log(`App is started and listening on port ${PORT}`));
