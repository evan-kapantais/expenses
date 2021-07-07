const usersRouter = require('express').Router();
const User = require('../models/user');
const Transaction = require('../models/transaction');
const Savings = require('../models/savings');
const Expenses = require('../models/expenses');
const Budget = require('../models/budget');

usersRouter.get('/', async (req, res) => {
	try {
		const users = await User.find({})
			.populate('transactions', { id: 1 })
			.populate('savings')
			.populate('budgets')
			.populate('expenses')
			.populate('categories');
		res.status(200).json(users);
	} catch (error) {
		res.status(404).json(error.message);
	}
});

usersRouter.get('/:id', async (req, res) => {
	try {
		const user = await User.findById(req.params.id)
			.populate('transactions')
			.populate('savings')
			.populate('budgets')
			.populate('expenses')
			.populate('categories');
		res.status(200).json(user);
	} catch (error) {
		res.status(404).json(error.message);
	}
});

usersRouter.put('/:id', async (req, res) => {
	try {
		const updated = await User.findByIdAndUpdate(req.params.id, req.body, {
			returnOriginal: false,
		});
		res.status(200).json(updated);
	} catch (error) {
		res.status(400).json(error.message);
	}
});

// TODO: delete all documents associated with the deleted user
usersRouter.delete('/:id', async (req, res) => {
	try {
		const user = await User.findById(req.params.id);

		if (user) {
			const budgets = await Budget.find({ user: req.params.id });
			const expenses = await Expenses.find({ user: req.params.id });
			const transactions = await Transaction.find({ user: req.params.id });
			const savings = await Savings.find({ user: req.params.id });

			// console.log(user);
			// console.log(budgets);
			// console.log(expenses);
			// console.log(transactions);
			// console.log(savings);

			budgets && budgets.forEach(async (b) => await b.delete());
			expenses && expenses.forEach(async (e) => await e.delete());
			transactions && transactions.forEach(async (t) => await t.delete());
			savings && savings.forEach(async (s) => await s.delete());

			await user.delete();
		}

		res.status(200).json(user);
	} catch (error) {
		res.status(400).json(error.message);
	}
});

module.exports = usersRouter;
