require('dotenv').config();
require('./models/connection');

var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

const app = express();
const cors = require('cors');
const allowedOrigins = ['https://dashboard.salmi-wassim.com', 'http://localhost:3000', 'https://money-dashboard-front.vercel.app'];

const corsOptions = {
  origin: function (origin, callback) {
    if (allowedOrigins.includes(origin) || !origin) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  optionsSuccessStatus: 200,
};

app.use(cors(corsOptions));

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var usersIncomeRouter = require('./routes/users-income');
var usersBalanceRouter = require('./routes/users-balance');
var usersExpensesRouter = require('./routes/users-expenses');
var usersSavingRouter = require('./routes/users-saving');
var usersExpensesCategoryRouter = require('./routes/users-expenses-category');
var usersDebtsRouter = require('./routes/users-debts');


var apiRouter = require('./routes/api');




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
app.use('/users/debts', usersDebtsRouter);


module.exports = app;
