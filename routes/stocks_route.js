const router = require('express').Router();
const { getStockQuantity, modifyStockQty } = require('../models/stocks_middlewares');

router.get('/', getStockQuantity, (req, res) => {
	res.render('home', {
		title: 'Készletek',
		layout: 'stock',
		products: false,
		stocks: true,
		categories: false,
		items: req.stockData
	});
});

router.post('/:id', modifyStockQty, (req, res) => {
	res.redirect('/stocks');
});

module.exports = router;
