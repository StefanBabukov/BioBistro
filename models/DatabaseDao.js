const nedb = require('nedb');
const events = require('../public/data.json')
const bcrypt = require('bcrypt');
const jwt = require("jsonwebtoken");
const saltRounds = 10;

class DatabaseDao {
constructor(dbFilePath) {
    if (dbFilePath) {
    this.db = new nedb({ filename: dbFilePath, autoload: true });
    console.log('DB connected to ' + dbFilePath);
    } else {
    this.db = new nedb();
    }
}
    init(){
        this.db.insert({
            subject: 'I liked the exhibition',
            contents: 'nice',
            published: '2020-02-16',
            author: 'Peter',
            type: 'comment'
            });

        events.forEach((event)=>{
            this.db.insert(event);
        })
    }
    getByType(type){
        return new Promise((resolve, reject) => {
            this.db.find({type}, function(err, entries) {
            if (err) {
                reject(err);
                //if no error resolve the promise & return the data
            } else {
                resolve(entries);
                //to see what the returned data looks like
                console.log('all the events: ', entries);
            }
            })
        })
    }

    getAll(){
        return new Promise((resolve, reject) => {
            this.db.find({}, function(err, entries) {
            if (err) {
                reject(err);
                //if no error resolve the promise & return the data
            } else {
                resolve(entries);
                //to see what the returned data looks like
                console.log('all the entries: ', entries);
            }
            })
        })
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

    // verifyToken(token){
    //     let accessToken = req.cookies.jwt;
    //     if (!accessToken) {
    //         return res.status(403).send();
    //     }
    //     let payload;
    //     try {
    //         payload = jwt.verify(accessToken, process.env.ACCESS_TOKEN_SECRET);
    //         next();
    //     } catch (e) {
    //           //if an error occured return request unauthorized error
    //     res.status(401).send();
    //     }
    // }

    createUser(username, password) {
        return new Promise((resolve, reject) => {
        const {db} = this;
        bcrypt.hash(password, saltRounds).then(function(hash) {
            var entry = {
                username,
                password: hash,
                type: 'user',
            };
            db.insert(entry, function (err) {
                if (err) {
                    console.log("Can't insert user: ", username);
                    reject(err)
                }
                resolve(entry);
            });
        });   
        });
    }

    addComment (comment, username){
        var today = new Date();
        var date = today.getFullYear()+'-'+(today.getMonth()+1)+'-'+today.getDate();
        const commentEntry = {
            author: username,
            contents: comment,
            published: date,
            type:'comment'
        }
        return new Promise((resolve, reject) => {
            this.db.insert(commentEntry, function (err) {
                if (err) {
                    console.log("Can't insert comment: ", comment);
                    reject(err)
                }
                resolve(commentEntry);
            });
        });
        }
}

const dao = new DatabaseDao();

module.exports=dao;
