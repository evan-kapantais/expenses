const mongoose = require('mongoose');

const categorySchema = new mongoose.Schema({
	name: {
		type: String,
		required: true,
	},
});

categorySchema.set('toJSON', {
	transform: (document, returnedDocument) => {
		returnedDocument.id = returnedDocument._id.toString();
		delete returnedDocument._id;
		delete returnedDocument.__v;
	},
});

const Category = mongoose.model('Category', categorySchema);

module.exports = Category;
