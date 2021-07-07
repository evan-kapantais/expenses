const budgetsRouter = require('express').Router();
const Budget = require('../models/budget');
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

budgetsRouter.get('/', async (req, res) => {
	try {
		const budgets = await Budget.find({}).populate('user', {
			username: 1,
		});
		res.status(200).json(budgets);
	} catch (error) {
		res.status(400).json({ error: error.message });
	}
});

budgetsRouter.get('/:id', async (req, res) => {
	try {
		const budget = await Budget.findById(req.params.id);
		res.status(200).json(budget);
	} catch (error) {
		res.status(400).json({ error: error.message });
	}
});

budgetsRouter.post('/', async (req, res) => {
	try {
		const token = getToken(req);
		const decodedToken = jwt.verify(token, process.env.SECRET);

		if (!token || !decodedToken) {
			return res.status(401).json({ error: 'Token invalid or missing' });
		}

		const user = await User.findById(decodedToken.id);

		const budget = new Budget({
			amount: req.body.amount,
			record: { ...user.record },
			user: user._id,
		});

		const savedBudget = await budget.save();

		user.budgets = user.budgets.concat(savedBudget._id);
		await user.save();

		res.status(200).json(savedBudget);
	} catch (error) {
		res.status(400).json({ error });
	}
});

budgetsRouter.delete('/:id', async (req, res) => {
	try {
		const deleted = await Budget.findByIdAndDelete(req.params.id);
		res.status(200).json(deleted);
	} catch (error) {
		res.status(400).json({ error: error.message });
	}
});

module.exports = budgetsRouter;
