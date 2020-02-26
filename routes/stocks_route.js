const router = require('express').Router();
const { getStockQuantity, modifyStockQty } = require('../models/stocks_middlewares');

router.get('/', getStockQuantity, (req, res) => {
	res.render('home', {
		title: 'Készletek',
		layout: 'stock',
		products: false,
		stocks: true,
		categories: false,
		items: req.stockData,
		showNext: req.hasNextPage,
		showPrev: req.hasPrevPage,
		maxPage: req.maxPage,
		totalProducts: req.totalProducts,
		nextPage: req.nextPage,
		prevPage: req.prevPage,
		lastPage: req.lastPage,
		curentPage: req.query.page
	});
});

router.post('/:id', modifyStockQty, (req, res) => {
	res.redirect('/stocks');
});

module.exports = router;
