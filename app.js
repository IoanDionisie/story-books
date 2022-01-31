const path = require('path');
const express = require('express');
const connectDB = require('./config/db');
const passport = require('passport'); 
const session = require('express-session');
const morgan = require('morgan');
var MongoDBStore = require('connect-mongodb-session')(session);
const mongoose = require('mongoose');

//const { engine } = require('express-handlebars');
const exphbs = require('express-handlebars');

// Load config
require('dotenv').config({path: './config/config.env'});

require('./config/passport')(passport)

connectDB();

const app = express();

// Body Parser
app.use(express.urlencoded({extended: false}));
app.use(express.json());

if (process.env.NODE_ENV === 'development') {
    app.use(morgan('dev'));
}

// Handlebars helpers
const { formatDate, stripTags, truncate, editIcon} = require('./helpers/hbs');


// Handlebars
app.engine('hbs', exphbs.engine({
    helpers: {formatDate, stripTags, truncate, editIcon},
    defaultLayout: 'main',
    extname: '.hbs'
}));
app.set('view engine', 'hbs');

var store = new MongoDBStore({
    uri: process.env.MONGO_URI,
    collection: 'sessions'
});

//Sessions
app.use(session( {
    secret: 'keyboard cat',
    resave: false,
    saveUninitialized: false,
    store: store
}));

//Passport midleware
app.use(passport.initialize())
app.use(passport.session())


// Static folder
app.use(express.static(path.join(__dirname, 'public')));

// Set global var
app.use(function(req, res, next) {
    res.locals.user = req.user || null;
    next();
})

// Routes
app.use('/', require('./routes/index'));
app.use('/auth', require('./routes/auth'));
app.use('/stories', require('./routes/stories'));

const PORT = process.env.PORT || 5000;

app.listen(PORT, console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`));

