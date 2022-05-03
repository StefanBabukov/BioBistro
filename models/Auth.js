const BaseModel = require('./DatabaseDao');
const Datastore = require("nedb");
const bcrypt = require('bcrypt');

const saltRounds = 10;

class Auth extends BaseModel {
    constructor() {
        super();
    }

    lookupUser(username, cb) {
        this.db.find({username}, function (err, entries) {

        if (err) {
            return cb(null, null);
        } else {
            if (entries.length == 0) {
                return cb(null, null);
            }
                return cb(null, entries[0]);
            }
        });
    }    

    login(username, password){
        this.lookupUser(username, function (err, user) {
            if (err) {
              console.log("error looking up user", err);
              return 401;
            }
            if (!user) {
              console.log("user ", username, " not found");
              return 403;
            }
            //compare provided password with stored password
            bcrypt.compare(password, user.password, function (err, result) {
              if (result) {
                //use the payload to store information about the user such as username.
                let payload = { username };
                //create the access token 
                let accessToken = jwt.sign(payload, process.env.ACCESS_TOKEN_SECRET,{expiresIn: 300}); 
                res.cookie("jwt", accessToken);
                next();
              } else {
                return res.render("user/login"); //res.status(403).send();
              }
            });
        });
    }

    createUser(username, password) {
        return new Promise((resolve, reject) => {

        bcrypt.hash(password, saltRounds).then(function(hash) {
            var entry = {
                username,
                password: hash,
                type: 'user',
            };
            this.db.insert(entry, function (err) {
            if (err) {
                console.log("Can't insert user: ", username);
                reject(err)
            }
            resolve(entry);
            });
        });   
        });
    }
}

module.exports = Auth;