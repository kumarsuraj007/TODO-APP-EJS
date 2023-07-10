const express = require('express');
const bodyParser = require('body-parser');
const passport = require('passport');
const sessions = require('express-session');
const { getName } = require('./date.js');
const date = require(__dirname + '/date.js');

const app = express();

// express-session and middleware
app.use(sessions({
    secret: 'dog',
    resave: true,
    saveUninitialized: true
}));
app.use(passport.initialize());
app.use(passport.session());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));
app.set("view engine", 'ejs');
require('./auth.js');

let items = ["Buy Food", "Buy Clothes", "Learn Marketing"];
let workItems = [];

// function to check weather a user loggedIn or not! 
function isLoggedIn (req, res, next) {
    req.user ? next() : res.sendStatus(401)
}


// google authentication 
app.get('/auth/google',
    passport.authenticate('google', {scope:['email', 'profile']})
);

app.get('/google/callback', passport.authenticate('google',{
    successRedirect: '/protected',
    failureRedirect: '/auth/failure'
}));

app.get('/auth/failure', (req, res) => {
    res.send('Something went wrong!')   
});

// requests 
app.get('/', (req, res) => {
    res.render('login')
});

app.get('/protected', isLoggedIn, (req, res) => {
let day = date.getDate();
let profileName = `Hello ${req.user.displayName}`;
    res.render("list", { listTitle: day, newItems: items, listName: profileName });
});

app.post('/', isLoggedIn, (req, res) => {
    var item = req.body.newItem;
    if(req.body.list === "Work") {
        workItems.push(item);
        res.redirect("/work")
    } else {
        items.push(item);
        res.redirect('/protected') 
    }
});

app.get('/work', (req, res) => {
    res.render('list', {listTitle: "Work List", newItems: workItems})
});

app.listen(4000, () => console.log('Server is running on port 4000!'));