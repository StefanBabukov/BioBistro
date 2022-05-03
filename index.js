const express = require('express');
const app = express();
require('dotenv').config() 

const cookieParser = require('cookie-parser')
app.use(cookieParser())

app.use(express.urlencoded({
    extended: true
  }))

const path = require('path');
const public = path.join(__dirname,'public');
app.use(express.static(public));

app.use('/css', express.static(__dirname + '/node_modules/bootstrap/dist/css')); 
//include app.css stylesheet
app.use('/css', express.static(__dirname + '/css'));


const mustache = require('mustache-express');
app.engine('mustache', mustache());
app.set('view engine', 'mustache');

const router = require('./routes/restaurantRoutes');
app.use('/', router);

app.listen(3000, () => {
    console.log('Server started on port 3000. Ctrl^c to quit.');
    })  