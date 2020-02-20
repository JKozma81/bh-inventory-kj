const express = require('express');
const path = require('path');
const hbs = require('express-handlebars');

const productsRouter = require('./routes/products_rout');


const PORT = 3000;
const app = express();
app.engine('handlebars', hbs());
app.set('view engine', 'handlebars');

app.use(express.static(path.join(__dirname, 'public')));

// app.get('/', (req, res) => {
// 	res.render('home', { title: 'Termékek', items: dummyData });
// });

app.use(productsRouter);




app.listen(PORT, () => console.log(`App is started and listening on port ${PORT}`));
