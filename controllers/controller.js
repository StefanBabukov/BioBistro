const Events = require("../models/Events");

const db = new Events();
db.init();

const registerView = (req, res) => {
    res.render("register", {});
}
// For View 
const loginView = (req, res) => {
    res.render("login", {});
}

const landingPage = (req, res) => {

    db.getByType('event')
    .then((entries) => {
        res.render("home", {events: entries, title: 'Home', breakfast: 'pancakes', lunch: "bio burgers", dinner: '4 course dinner for $10'});
    })
    .catch((err) => {
      console.log("Error: ");
      console.log(JSON.stringify(err));
    });
}

const menuPage = (req, res) => {
    res.render("menu", {title: 'Menu'});
}

const aboutUsPage = (req, res) => {
    res.render("aboutUs", {title: 'About Us'});
}

module.exports =  {
    landingPage,
    menuPage,
    aboutUsPage,
    registerView,
    loginView
};