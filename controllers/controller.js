const registerView = (req, res) => {
    res.render("register", {});
}
// For View 
const loginView = (req, res) => {
    res.render("login", {});
}

const landingPage = (req, res) => {
    res.render("home", {title: 'Bio Bistro', dinner: 'Chicken Biryani', lunch:'Pizza'});
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