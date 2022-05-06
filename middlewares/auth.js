const bcrypt = require("bcrypt");
const db = require("../models/DatabaseDao");
const jwt = require("jsonwebtoken");

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
