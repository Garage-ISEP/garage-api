var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
const bodyParser = require('body-parser');
const cors = require('cors');

var indexRouter = require('./routes/index');
var calendarRouter = require('./routes/calendar');

var app = express();

if(process.env.NODE_ENV === "production") {
  app.use(logger('combined'));
} else {
  app.use(logger('dev'));
}

app.set('trust proxy', true);
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(bodyParser.json());
app.use(cors());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/calendar', calendarRouter);

module.exports = app;
