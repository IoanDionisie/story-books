const path = require('path');
const express = require('express');
const dotenv = require('dotenv');
const connectDB = require('./config/db');
const passport = require('passport'); 
const session = require('express-session');
const morgan = require('morgan');

//const { engine } = require('express-handlebars');
const exphbs = require('express-handlebars');

// Load config
dotenv.config({path: './config/cofig.env'});

require('./config/passport')(passport)

connectDB();

const app = express();

if (process.env.NODE_ENV === 'development') {
    app.use(morgan('dev'));
}

app.engine('hbs', exphbs.engine({defaultLayout: 'main', extname: '.hbs'}));
app.set('view engine', 'hbs');

//Sessions
app.use(session( {
    secret: 'keyboard cat',
    resave: false,
    saveUninitialized: false
}));

//Passport midleware
app.use(passport.initialize())
app.use(passport.session())

app.use(express.static(path.join(__dirname, 'public')));

// Routes
app.use('/', require('./routes/index'));
app.use('/auth', require('./routes/auth'));

const PORT = process.env.PORT || 5000;

app.listen(PORT, console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`));