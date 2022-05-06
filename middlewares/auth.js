const bcrypt = require("bcrypt");
const db = require("../models/DatabaseDao");
const jwt = require("jsonwebtoken");

exports.login = function (req, res,next) {
    const {username, password} = req.body;
    db.getAll();
    db.lookupUser(username, function (err, user) {
        if (err) {
        console.log("error looking up user", err);
        return res.status(401).send();
        }
        if (!user) {
        console.log("user ", username, " not found");
        return res.render("/register");
        }

        bcrypt.compare(password, user.password, function (err, result) {
        if (result) {
            let payload = { username: username };
            
            //create the access token 
            let accessToken = jwt.sign(payload, 'zxczxczxc',{}); 
            res.cookie("jwt", accessToken);
            req.cookies.jwt = accessToken;
            next();
        } else {
           res.status(403).send();
        }
        });
  });
};

exports.verify = function (req, res, next) {
  let accessToken = req.cookies.jwt;
  if (!accessToken) {
    return res.status(403).send();
  }
  let payload;
  try {
    payload = jwt.verify(accessToken, 'zxczxczxc');
    next();
  } catch (e) {
    res.status(401).send();
  }
};

exports.adminVerify = function (req, res, next) {
  let accessToken = req.cookies.jwt;
  if (!accessToken) {
    return res.status(403).send();
  }
  let payload;
  try {
    payload = jwt.verify(accessToken, 'zxczxczxc');
    if (payload.username === "admin") {
      next();
    }
    else {
      res.status(403).send();
    }
  } catch (e) {
    res.status(401).send();
  }
}
