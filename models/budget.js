const mongoose = require('mongoose');

const budgetSchema = new mongoose.Schema({
	amount: Number,
	record: {
		month: Number,
		year: Number,
	},
	user: {
		type: mongoose.Schema.Types.ObjectId,
		ref: 'User',
	},
});

budgetSchema.set('toJSON', {
	transform: (object, returnedObject) => {
		(returnedObject.id = returnedObject._id.toString()),
			delete returnedObject._id;
		delete returnedObject.__v;
	},
});

const Budget = mongoose.model('Budget', budgetSchema);

module.exports = Budget;
