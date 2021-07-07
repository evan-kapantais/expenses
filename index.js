const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');

const transactionsRouter = require('./controllers/transactions');
const loginRouter = require('./controllers/login');
const registerRouter = require('./controllers/register');
const savingsRouter = require('./controllers/savings');
const usersRouter = require('./controllers/users');
const budgetsRouter = require('./controllers/budgets');
const expensesRouter = require('./controllers/expenses');
const categoriesRouter = require('./controllers/categories');

const app = express();

dotenv.config();

console.log(`Connecting to MongoDB cluster...`);

mongoose
	.connect(process.env.MONGO_URI, {
		useCreateIndex: true,
		useFindAndModify: false,
		useNewUrlParser: true,
		useUnifiedTopology: true,
	})
	.then(() => console.log(`Connection to MongoDB established.`))
	.catch((error) => console.error(error.message));

app.use(express.json());
app.use('/api/transactions', transactionsRouter);
app.use('/api/login', loginRouter);
app.use('/api/register', registerRouter);
app.use('/api/savings', savingsRouter);
app.use('/api/users', usersRouter);
app.use('/api/budgets', budgetsRouter);
app.use('/api/expenses', expensesRouter);
app.use('/api/categories', categoriesRouter);

app.get('/', (req, res) => res.send('Base url!'));

app.listen(process.env.PORT, () =>
	console.log(`App running on port ${process.env.PORT}`)
);
