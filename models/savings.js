const mongoose = require('mongoose');

const savingsSchema = new mongoose.Schema({
	amount: {
		type: Number,
		required: true,
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
	user: {
		type: mongoose.Schema.Types.ObjectId,
		ref: 'User',
	},
});

savingsSchema.set('toJSON', {
	transform: (document, returnedDocument) => {
		returnedDocument.id = returnedDocument._id.toString();
		delete returnedDocument._id;
		delete returnedDocument.__v;
	},
});

const Savings = mongoose.model('Savings', savingsSchema);

module.exports = Savings;
