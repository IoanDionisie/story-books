const express = require('express');
const dotenv = require('dotenv');
const connectDB = require('./config/db');
const exphbs = require('express-handlebars');
const morgan = require('morgan');


// Load config
dotenv.config({path: './config/cofig.env'});

connectDB();

const app = express();

if (process.env.NODE_ENV === 'development') {
    app.use(morgan('dev'));
}

const PORT = process.env.PORT || 5000;

app.listen(PORT, console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`));