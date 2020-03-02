const router = require('express').Router();
const { getStockQuantity, modifyStockQty } = require('../models/stocks_middlewares');

router.get('/', getStockQuantity, (req, res) => {
	res.render('home', {
		title: 'Készletek',
		layout: 'main',
		items: req.stockData,
		showNext: req.limit * (+req.query.page ? +req.query.page : 1) < req.totalProducts,
		showPrev: req.query.page ? +req.query.page > 1 : false,
		maxPage: req.maxPage,
		totalProducts: req.totalProducts,
		nextPage: req.query.page ? +req.query.page + 1 : 2,
		prevPage: req.query.page ? +req.query.page - 1 : 1,
		lastPage: Math.ceil(req.totalProducts / req.limit),
		curentPage: Object.keys(req.query).length === 0 ? 1 : req.query.page,
		order: Object.keys(req.query).length === 0 ? 'ASC' : req.query.order,
		orderby: Object.keys(req.query).length === 0 ? 'id' : req.query.orderby,
		menu: 'stocks'
	});
});

router.post('/:id', modifyStockQty, (req, res) => {
	res.redirect('/stocks');
});

module.exports = router;
