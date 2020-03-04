const router = require('express').Router();
const { getWarehouses, modifyWarehouse, deleteWarehouse, newWarehouse } = require('../models/warehouses_middlewares');

router.get('/', getWarehouses, (req, res) => {
	const warehouses = [];
	req.whData.forEach(warehouseInfo => {
		const whData = {};
		const splitAddress = warehouseInfo.address.split(', ');
		whData.id = warehouseInfo.id;
		const whID = req.stockQtyData.find(whId => whId.id === warehouseInfo.id);

		if (whID) {
			whData.canBeDeleted = whID.items > 0 ? false : true;
		} else {
			whData.canBeDeleted = true;
		}

		whData.name = warehouseInfo.name;
		whData.country = splitAddress[0];
		whData.zip = splitAddress[1];
		whData.city = splitAddress[2];
		whData.streetAndhn = splitAddress[3];
		warehouses.push(whData);
	})

	res.render('home', {
		title: 'Raktárak',
		warehouses: warehouses,
		menu: 'warehouses'
	});
});

router.post('/', newWarehouse, (req, res) => {
	res.redirect('/warehouses');
});

router.post('/:id', modifyWarehouse, (req, res) => {
	res.redirect('/warehouses');
});

router.post('/del/:id', deleteWarehouse, (req, res) => {
	res.redirect('/warehouses');
});

module.exports = router;
