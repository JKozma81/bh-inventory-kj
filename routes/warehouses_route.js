const router = require('express').Router();
const { getWarehouses, modifyWarehouse, deleteWarehouse } = require('../models/warehouses_middlewares');

router.get('/', getWarehouses, (req, res) => {
	res.render('home', {
		title: 'Raktárak',
		items: req.stockData,
		menu: 'warehouses'
	});
});

router.post('/:id', modifyWarehouse, (req, res) => {
	res.redirect('/warehouses');
});

router.post('/del/:id', deleteWarehouse, (req, res) => {
	res.redirect('/warehouses');
});

module.exports = router;
