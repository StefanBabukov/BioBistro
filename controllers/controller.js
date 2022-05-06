// const Events = require("../models/Events");
// const Auth = require("../models/Auth");
const jwt = require("jsonwebtoken");

const db = require("../models/DatabaseDao");
// const auth = new Auth();
db.init();

const registerView = (req, res) => {
    res.render("register", {});
}

const getUser = (req, res) => {
    let accessToken = req.cookies.jwt;
    let result = {username:''}

    if(!accessToken){
        return result;
    }
    result = jwt.decode(accessToken);
    if(result.username === 'admin'){
        result.isAdmin = true;
    }
    return result
}

const addMenuItem = async(req, res) => {
    const {dishTitle, dishDescription, dish, price } = req.body;
    db.addMenuItem(dishTitle, dishDescription,price, dish).then(res.redirect('/menu'));
    console.log('NEW DISH', dish, 'DISH TITLE', dishTitle, 'DISH DESCRIPTION', dishDescription, 'price ', price);

}

const addItemPage = async(req, res) => {
    const {username} = getUser(req, res);
    if(username!=='admin'){
        res.send(403,'Not admin.')
    }
    res.render("addMenuItem", {title: 'Add Item'});
}

const landingPage = async(req, res) => {

    const {username} = getUser(req, res);
    const comments = await db.getByType('comment')
    const events = await db.getByType('event')

    res.render("home", {events, comments, user: username, title: 'Home', breakfast: 'pancakes', lunch: "bio burgers", dinner: '4 course dinner for $10'});
}

const menuPage = async(req, res) => {
    const category = req.params.category || 'beverages';
    
    const {username, isAdmin} = getUser(req, res);
    const wholeMenu = await db.getByType('food');
    let menuFiltered = wholeMenu.filter(food => food.category === category);

    if(!isAdmin){
        // if its not admin, the disabled menu items by the chef are not shown
        menuFiltered = menuFiltered.filter(food => food.disabled === false);
    }

    res.render("menu", {title: 'Menu', user:username, food: menuFiltered, imageUrl:`/${category}.jpeg`, isAdmin});
}

const registerPage = (req, res) => {
    res.render("register", {title: 'Register'});
}

const registerUser = (req, res) => {
    const user = req.body;

    const {pass: password, username} = user;
    if (!username || !password) {
        res.send(401, "no user or no password");
        return;
    }

    db.lookupUser(username, function (err, user) {
        if (user) {
          res.send(401, "User exists:", username);
          return;
        }
        db.createUser(username, password).then(res.redirect('/login'));
    });

}

const login = (req, res) => {
    const {password, username} = req.body;
    
    if (!username || !password) {
        res.send(401, "no user or no password");
        return;
    }

    db.login(username, password)
}

const loginPage = (req, res) => {
    res.render("login", {title: 'Login'});
}
const aboutUsPage = (req, res) => {
    const {username} = getUser(req, res);

    res.render("aboutUs", {title: 'About Us', user:username});
}

const logout = (req, res) => {
    res.clearCookie('jwt');
    res.redirect('/');
}

const postComment = async(req, res) => {
    const {comment} = req.body;
    const token = req.cookies.jwt;
    const {username} = jwt.decode(token);

 
    try{
        await db.addComment(comment,username)
        res.redirect('/');
    } catch(e){
        console.log('ERROR INSERTING COMMENT', e)
    }
}

module.exports =  {
    landingPage,
    loginPage,
    logout,
    login,
    menuPage,
    aboutUsPage,
    registerView,
    registerUser,
    addItemPage,
    addMenuItem,
    registerPage,
    postComment,
};