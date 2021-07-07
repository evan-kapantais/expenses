const mongoose = require('mongoose');

// TODO: store the currency directly in the user

const userSchema = new mongoose.Schema({
	username: {
		type: String,
		required: [true, 'A user username is required'],
	},
	name: {
		type: String,
		required: [true, 'A user name is required'],
	},
	passwordHash: {
		type: String,
		required: [true, 'A user password is required'],
	},
	currency: {
		type: String,
		required: true,
	},
	transactions: [
		{
			type: mongoose.Schema.Types.ObjectId,
			ref: 'Transaction',
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
	savings: [
		{
			type: mongoose.Schema.Types.ObjectId,
			ref: 'Savings',
		},
	],
	budgets: [
		{
			type: mongoose.Schema.Types.ObjectId,
			ref: 'Budget',
		},
	],
	expenses: [
		{
			type: mongoose.Schema.Types.ObjectId,
			ref: 'Expenses',
		},
	],
	categories: [
		{
			type: mongoose.Schema.Types.ObjectId,
			ref: 'Category',
		},
	],
});

userSchema.set('toJSON', {
	transform: (document, returnedObject) => {
		returnedObject.id = returnedObject._id.toString();
		delete returnedObject._id;
		delete returnedObject.__v;
		delete returnedObject.passwordHash;
	},
});

const User = mongoose.model('User', userSchema);

module.exports = User;
