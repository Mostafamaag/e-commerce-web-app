require('dotenv').config()

const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const session = require('express-session');
const errorController = require('./controllers/error');
const MongoDBStore = require('connect-mongodb-session')(session);
const csrf = require('csurf');
const flash = require('connect-flash');

const mongoose = require('mongoose');
const User = require('./models/user');

const MONGO_URI = process.env.MONGO_URI;
const app = express();
app.use(flash());

const store = new MongoDBStore({
    uri: MONGO_URI,
    collection: 'sessions'
})

const csrfProtection = csrf();
app.set('view engine', 'ejs');
app.set('views', 'views');

const adminRoutes = require('./routes/admin');
const shopRoutes = require('./routes/shop');
const authRoutes = require('./routes/auth');


app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use(express.static(path.join(__dirname, 'public')));
app.use(
    session({
        secret: process.env.SESSION_KEY,
        resave: false, saveUninitialized: false,
        store: store
    })
);

app.use(csrfProtection)

app.use((req, res, next) => {
    res.locals.isAuthenticated = req.session.isLoggedIn;
    res.locals.csrfToken = req.csrfToken();
    next();
})

app.use((req, res, next) => {

    if (!req.session.user) {
        console.log("No sessions found");
        return next();
    }
    User.findById(req.session.user._id)
        .then(user => {
            if (!user) next();
            req.user = user;
            next();
        })
        .catch(err => {
            next(err);
        });

})



app.use('/admin', adminRoutes);
app.use(shopRoutes);
app.use(authRoutes);

app.get('/500', errorController.get500)

//handle all invalid incoming requests
app.use(errorController.get404);

//global error handling middleware
app.use((error, req, res, next) => {
    res.status(500).render('500', {
        pageTitle: 'Error',
        path: '/500',
    });
})

mongoose
    .connect(MONGO_URI)
    .then((result) => {
        console.log('Connected to DataBase!')
        app.listen(3000);
    })
    .catch(err => {
        console.log(err);
    })


