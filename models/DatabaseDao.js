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
            }
            })
        })
    }
    addMenuItem(title, description, price, category){

        const entry ={
            type: 'food',
            name: title,
            disabled: false,
            description,
            category,
            price
        }
        return new Promise((resolve, reject) => {
            this.db.insert(entry, function (err) {
                if (err) {
                    console.log("Can't insert menu item: ", title);
                    reject(err)
                }
                resolve(entry);
            });
        })
    }

    setMenuItemAvailability(disabled, id){
        console.log('DISABLED IS ', disabled,JSON.parse(disabled)===false)
        const a = false
        return new Promise((resolve, reject) => {
            this.db.update({_id: id}, {$set: {disabled:JSON.parse(disabled)}}, function (err) {
                if (err) {
                    reject(err)
                }
                resolve();
            });
        });
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
