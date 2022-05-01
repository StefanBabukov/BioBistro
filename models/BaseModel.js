const nedb = require('nedb');

class BaseModel {
constructor(dbFilePath) {
    if (dbFilePath) {
    this.db = new nedb({ filename: dbFilePath, autoload: true });
    console.log('DB connected to ' + dbFilePath);
    } else {
    this.db = new nedb();
    }
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
}

module.exports= BaseModel;