const router = require('express').Router();
const { getAllProducts, modifyProduct, deleteProduct, createNewProduct } = require('../models/products_middlewares');

router.get('/', getAllProducts, (req, res) => {

	const refinedData = req.products.map((prod) => {
		return {
			id: prod.id,
			name: prod.name,
			description: prod.description,
			category: prod.category ? prod.category : 'n/a'
		};
	});

	res.render('home', {
		title: 'Termékek',
		products: true,
		stocks: false,
		groups: false,
		items: refinedData,
		categories: req.categories
	});

});

router.post('/', createNewProduct, (req, res) => {
	res.redirect('/products');
});

router.post('/:id', modifyProduct, (req, res) => {
	res.redirect('/products');
});

router.post('/del/:id', deleteProduct, (req, res) => {
	res.redirect('/products');
});

module.exports = router;
