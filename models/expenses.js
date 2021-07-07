const mongoose = require('mongoose');

const expensesSchema = new mongoose.Schema({
	expenses: [
		{
			name: {
				type: String,
				required: true,
			},
			amount: {
				type: Number,
				required: true,
			},
		},
	],
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
	user: {
		type: mongoose.Schema.Types.ObjectId,
		ref: 'User',
	},
});

expensesSchema.set('toJSON', {
	transform: (object, returnedObject) => {
		(returnedObject.id = returnedObject._id.toString()),
			delete returnedObject._id;
		delete returnedObject.__v;
	},
});

const Expenses = mongoose.model('Expenses', expensesSchema);

module.exports = Expenses;
