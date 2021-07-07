const jwt = require('jsonwebtoken');
const categoriesRouter = require('express').Router();
const Category = require('../models/category');
const User = require('../models/user');

const getToken = (req) => {
	const auth = req.get('authorization');
	if (auth && auth.toLowerCase().startsWith('bearer ')) {
		return auth.substring(7);
	}

	return null;
};

categoriesRouter.get('/', async (req, res) => {
	try {
		const categories = await Category.find({});
		res.status(200).json(categories);
	} catch (error) {
		res.status(404).json(error.message);
	}
});

categoriesRouter.get('/:id', async (req, res) => {
	try {
		const category = await Category.findById(req.params.id);
		res.status(200).json(category);
	} catch (error) {
		res.status(404).json(error.message);
	}
});

// TODO: Check for duplicates
categoriesRouter.post('/', async (req, res) => {
	try {
		const existing = await Category.findOne({ name: req.body.name });

		if (existing) {
			return res
				.status(200)
				.json({ message: 'No need to create a new category.' });
		}

		const token = getToken(req);
		const decodedToken = jwt.verify(token, process.env.SECRET);

		if (!token || !decodedToken) {
			return res.status(401).json({ error: 'Token invalid or missing' });
		}

		const user = await User.findById(decodedToken.id);

		const category = new Category({
			name: req.body.name,
		});

		const saved = await category.save();

		user.categories = user.categories.concat(saved._id);
		await user.save();

		res.status(200).json(saved);
	} catch (error) {
		res.status(400).json({ error: error.message });
	}
});

categoriesRouter.delete('/:id', async (req, res) => {
	try {
		const category = await Category.findByIdAndDelete(req.params.id);
		res.status(200).json(category);
	} catch (error) {
		res.status(400).json(error.message);
	}
});

module.exports = categoriesRouter;
