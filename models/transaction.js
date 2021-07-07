const mongoose = require('mongoose');

const transactionSchema = new mongoose.Schema({
	name: {
		type: String,
		required: true,
	},
	category: {
		type: String,
		default: 'General',
	},
	type: {
		type: String,
		required: true,
	},
	account: String,
	date: {
		type: Date,
		default: new Date(),
	},
	amount: {
		type: Number,
		required: true,
	},
	user: {
		type: mongoose.Schema.Types.ObjectId,
		ref: 'User',
	},
	record: {
		month: {
			type: Number,
			required: true,
		},
		year: {
			type: Number,
			required: true,
		},
	},
});

transactionSchema.set('toJSON', {
	transform: (document, returned) => {
		returned.id = returned._id.toString();
		delete returned._id;
		delete returned.__v;
	},
});

const Transaction = mongoose.model('Transaction', transactionSchema);

module.exports = Transaction;
