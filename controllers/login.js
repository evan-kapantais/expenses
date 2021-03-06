const loginRouter = require('express').Router();
const User = require('../models/user');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

loginRouter.post('/', async (req, res) => {
	const user = await User.findOne({ username: req.body.username });

	try {
		const passwordCorrect =
			user === null
				? false
				: await bcrypt.compare(req.body.password, user.passwordHash);

		if (!(user && passwordCorrect)) {
			return res.status(401).json({ error: 'Invalid username or password' });
		}

		const userForToken = {
			username: user.username,
			id: user._id,
		};

		const token = jwt.sign(userForToken, process.env.SECRET);

		res.status(200).send({
			token,
			username: user.username,
			name: user.name,
			currency: user.currency,
			id: user.id,
			record: user.record,
		});
	} catch (error) {
		res.status(400).json(error.message);
	}
});

module.exports = loginRouter;
