const router = require('express').Router();
const { getAlldata, newCategory, modifyCategory, deleteCategory } = require('../models/category_middlewares');

router.get('/', getAlldata, (req, res) => {
	res.render('home', {
		title: 'Csoportok',
		layout: 'main',
		items: req.data,
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
		menu: 'categories'
	});
});

router.post('/', newCategory, (req, res) => {
	res.redirect('/categories');
});

router.post('/:id', modifyCategory, (req, res) => {
	res.redirect('/categories');
});

router.post('/del/:id', deleteCategory, (req, res) => {
	res.redirect('/categories');
});

module.exports = router;
