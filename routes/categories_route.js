const router = require('express').Router();
const { getAlldata, newCategory, modifyCategory, deleteCategory, deleteSubCategory } = require('../models/category_middlewares');

router.get('/', getAlldata, (req, res) => {

	const mainCategories = req.mainCategories.map(item => {
		return {
			main_cat_id: item.main_cat_id,
			main_cat_name: item.main_cat_name,
			subcategories: item.subcategories ? item.subcategories : 'n/a',
			canBeDeleted: item.subcategories ? false : true
		}
	})

	const hierarchy = [];

	req.mainCategories.forEach(mainCateg => {
		const tempObj = {};
		({ main_cat_id: tempObj.id, main_cat_name: tempObj.name } = mainCateg);

		tempObj.subCategories = [];

		req.categoryHierarchy.filter(item => item.main_cat_name === mainCateg.main_cat_name).forEach(categories => {
			const subTempObj = {};
			({ sub_cat_id: subTempObj.id, subcategory: subTempObj.name } = categories)
			if (subTempObj.id !== null) tempObj.subCategories.push(subTempObj);
		})
		tempObj.canBeDeleted = tempObj.subCategories.length === 0 ? true : false;
		hierarchy.push(tempObj);
	})

	res.render('home', {
		title: 'Csoportok',
		maincategories: mainCategories,
		categHierarchy: hierarchy,
		showNext: req.limit * (+req.query.page ? +req.query.page : 1) < req.totalCategories,
		showPrev: req.query.page ? +req.query.page > 1 : false,
		nextPage: req.query.page ? +req.query.page + 1 : 2,
		prevPage: req.query.page ? +req.query.page - 1 : 1,
		lastPage: Math.ceil(req.totalCategories / req.limit),
		curentPage: Object.keys(req.query).length === 0 ? 1 : +req.query.page,
		order: Object.keys(req.query).length === 0 ? 'ASC' : req.query.order,
		orderby: Object.keys(req.query).length === 0 ? 'id' : req.query.orderby,
		menu: 'categories'
	});
});

router.post('/', newCategory, (req, res) => {
	res.redirect('/categories');
});

router.post('/del', deleteSubCategory, (req, res) => {
	res.redirect('/categories');
});

router.post('/:id', modifyCategory, (req, res) => {
	res.redirect('/categories');
});

router.post('/del/:id', deleteCategory, (req, res) => {
	res.redirect('/categories');
});

module.exports = router;
