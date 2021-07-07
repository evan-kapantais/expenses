const registerRouter = require('express').Router();
const User = require('../models/user');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

registerRouter.post('/', async (req, res) => {
	try {
		const existing = await User.findOne({ username: req.body.username });

		if (existing) {
			return res.status(400).json({ error: 'Username already exists' });
		}

		const saltRounds = 10;
		const passwordHash = await bcrypt.hash(req.body.password, saltRounds);

		const newUser = new User({
			username: req.body.username,
			name: req.body.name,
			passwordHash,
			currency: req.body.currency,
			record: { ...req.body.record },
		});

		const savedUser = await newUser.save();

		const userForToken = {
			username: savedUser.username,
			id: savedUser._id,
		};

		const token = await jwt.sign(userForToken, process.env.SECRET);

		res.status(201).send({
			token,
			username: savedUser.username,
			name: savedUser.name,
			currency: savedUser.currency,
			id: savedUser._id,
			record: { ...savedUser.record },
		});
	} catch (error) {
		res.status(400).json({ error: error.message });
	}
});

module.exports = registerRouter;
