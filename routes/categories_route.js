const router = require('express').Router();
const { getAlldata, newCategory, modifyCategory, deleteCategory } = require('../models/category_middlewares');

router.get('/', getAlldata, (req, res) => {

	res.render('categories', {
		title: 'Csoportok',
		layout: 'groups',
		products: false,
		stocks: false,
		groups: true,
		items: req.data
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
