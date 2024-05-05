require('dotenv').config();
require('./models/connection');

var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var usersIncomeRouter = require('./routes/users-income');
var usersBalanceRouter = require('./routes/users-balance');
var usersExpensesRouter = require('./routes/users-expenses');
var usersSavingRouter = require('./routes/users-saving');
var usersExpensesCategoryRouter = require('./routes/users-expenses-category');

var apiRouter = require('./routes/api');


var app = express();
const cors = require('cors');

app.use(cors());
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/api', apiRouter);
app.use('/users', usersRouter);
app.use('/users/income', usersIncomeRouter);
app.use('/users/balance', usersBalanceRouter);
app.use('/users/expenses', usersExpensesRouter);
app.use('/users/saving', usersSavingRouter);
app.use('/users/expenses-category', usersExpensesCategoryRouter);


module.exports = app;
