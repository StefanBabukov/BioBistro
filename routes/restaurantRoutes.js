const express = require('express');
const router = express.Router();
const controller = require('../controllers/controller.js');
const {login, verify} = require('../middlewares/auth.js');
router.get("/", controller.landingPage);
router.get('/menu', controller.menuPage);
router.get('/aboutUs', controller.aboutUsPage);
router.get('/login', controller.loginPage)
router.get('/register', controller.registerPage);
router.get('/logout', controller.logout);
router.get('/menu/edit', controller.addItemPage);
router.get('/menu/:category', controller.menuPage);

router.post('/register', controller.registerUser);
router.post('/login', login, controller.landingPage);
router.post('/comment', controller.postComment);
router.post('/menu/edit', controller.addMenuItem);
// router.get('/register', controller.registerView);


router.use(function(req, res) {
        res.status(404);
        res.type('text/plain');
        res.send('404 Not found.');
    });
router.use(function(err, req, res, next) {
        res.status(500);
        res.type('text/plain');
        res.send('Internal Server .');
    });
module.exports = router;