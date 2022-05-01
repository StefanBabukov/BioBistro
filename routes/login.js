const express = require('express');
const {registerView, loginView } = require('../controllers/controller');
const router = express.Router();

router.get('/register', registerView);
router.get('/login', loginView);

router.use(function(req, res) {
    res.status(404);
    res.type('text/plain');
    res.send('404 Not found.');
})
router.use(function(err, req, res, next) {
    res.status(500);
    res.type('text/plain');
    res.send('Internal Server .');
})

module.exports = router;