const savingsRouter = require('express').Router();
const Savings = require('../models/savings');
const User = require('../models/user');
const jwt = require('jsonwebtoken');

// TODO: verify new tranaction fields
// TODO: require token to delete transaction
// TODO: delete user transaction when deleting transaction

const getToken = (req) => {
	const auth = req.get('authorization');
	if (auth && auth.toLowerCase().startsWith('bearer ')) {
		return auth.substring(7);
	}

	return null;
};

savingsRouter.get('/', async (req, res) => {
	try {
		const savings = await Savings.find({}).populate('user', { id: 1 });
		res.status(200).json(savings);
	} catch (error) {
		res.status(400).json({ error: error.message });
	}
});

savingsRouter.get('/:id', async (req, res) => {
	try {
		const savings = await Savings.findById(req.params.id);
		res.status(200).json(savings);
	} catch (error) {
		res.status(400).json({ error: error.message });
	}
});

savingsRouter.post('/', async (req, res) => {
	try {
		const token = getToken(req);
		const decodedToken = jwt.verify(token, process.env.SECRET);

		if (!token || !decodedToken) {
			return res.status(401).json({ error: 'Token invalid or missing' });
		}

		const user = await User.findById(decodedToken.id);

		const savings = new Savings({
			amount: req.body.amount,
			record: { ...user.record },
			user: user._id,
		});

		const savedSavings = await savings.save();

		user.savings = user.savings.concat(savedSavings._id);
		await user.save();

		res.status(200).json(savedSavings);
	} catch (error) {
		res.status(400).json({ error: error.message });
	}
});

// TODO: this also
savingsRouter.delete('/:id', async (req, res) => {
	try {
		const deleted = await Savings.findByIdAndDelete(req.params.id);
		res.status(200).json(deleted);
	} catch (error) {
		res.status(400).json({ error: error.message });
	}
});

module.exports = savingsRouter;
