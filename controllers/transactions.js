const transactionsRouter = require('express').Router();
const Transaction = require('../models/transaction');
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

transactionsRouter.get('/', async (req, res) => {
	try {
		const transactions = await Transaction.find({})
			.sort({ date: -1 })
			.populate('user', {
				username: 1,
			});
		res.status(200).json(transactions);
	} catch (error) {
		res.status(400).json({ error: error.message });
	}
});

transactionsRouter.get('/:id', async (req, res) => {
	try {
		const transaction = await Transaction.findById(req.params.id);
		res.status(200).json(transaction);
	} catch (error) {
		res.status(400).json({ error: error.message });
	}
});

transactionsRouter.post('/', async (req, res) => {
	try {
		const token = getToken(req);
		const decodedToken = jwt.verify(token, process.env.SECRET);

		if (!token || !decodedToken) {
			return res.status(401).json({ error: 'Token invalid or missing' });
		}

		const user = await User.findById(decodedToken.id);

		const transaction = new Transaction({
			...req.body,
			user: user._id,
			record: { ...user.record },
		});
		const savedTransaction = await transaction.save();

		user.transactions = user.transactions.concat(savedTransaction._id);
		await user.save();

		res.status(200).json(savedTransaction);
	} catch (error) {
		res.status(400).json({ error: error.message });
	}
});

transactionsRouter.put('/:id', async (req, res) => {
	try {
		const token = getToken(req);
		const decodedToken = jwt.verify(token, process.env.SECRET);

		if (!token || !decodedToken) {
			return res.status(401).json({ error: 'Token invalid or missing' });
		}

		const updated = await Transaction.findByIdAndUpdate(req.params.id, {
			...req.body,
		});

		res.status(200).json(updated);
	} catch (error) {
		res.status(400).json({ error: error.message });
	}
});

transactionsRouter.delete('/:id', async (req, res) => {
	try {
		const deleted = await Transaction.findByIdAndDelete(req.params.id);
		res.status(200).json(deleted);
	} catch (error) {
		res.status(400).json({ error: error.message });
	}
});

module.exports = transactionsRouter;
