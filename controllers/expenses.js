const expensesRouter = require('express').Router();
const Expenses = require('../models/expenses');
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

expensesRouter.get('/', async (req, res) => {
	try {
		const expenses = await Expenses.find({}).populate('user', {
			username: 1,
		});
		res.status(200).json(expenses);
	} catch (error) {
		res.status(400).json({ error: error.message });
	}
});

expensesRouter.get('/:id', async (req, res) => {
	try {
		const Expenses = await Expenses.findById(req.params.id);
		res.status(200).json(Expenses);
	} catch (error) {
		res.status(400).json({ error: error.message });
	}
});

expensesRouter.post('/', async (req, res) => {
	try {
		const token = getToken(req);
		const decodedToken = jwt.verify(token, process.env.SECRET);

		if (!token || !decodedToken) {
			return res.status(401).json({ error: 'Token invalid or missing' });
		}

		const user = await User.findById(decodedToken.id);

		const expenses = new Expenses({
			expenses: [...req.body.expenses],
			record: { ...user.record },
			user: user._id,
		});

		const savedExpenses = await expenses.save();

		user.expenses = user.expenses.concat(savedExpenses._id);
		await user.save();

		res.status(200).json(savedExpenses);
	} catch (error) {
		res.status(400).json({ error: error.message });
	}
});

expensesRouter.delete('/:id', async (req, res) => {
	try {
		const deleted = await Expenses.findByIdAndDelete(req.params.id);
		res.status(200).json(deleted);
	} catch (error) {
		res.status(400).json({ error: error.message });
	}
});

module.exports = expensesRouter;
