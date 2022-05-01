const BaseModel = require('./BaseModel');
const events = require('../public/data.json')
class Events extends BaseModel {
  constructor() {
    super();
    this.events = {};
  }

  init(){
    console.log('EVENTS', events)
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
        //for later debugging
        
        // this.db.insert({comments:{
        // subject: "Didn't like it",
        // contents: 'A really terrible style!',
        // published: '2020-02-18',
        // author: 'Ann'
        // }});
        //for later debugging

    console.log('DATABASE POPULATED')
  }

  async getEvents() {
        // const results = await this.db.find({});
    return new Promise((resolve, reject) => {

        this.db.find({}, function(err, entries) {
        if (err) {
            reject(err);
            //if no error resolve the promise & return the data
        } else {
            resolve(entries);
            //to see what the returned data looks like
            console.log('all the events!!!: ', entries);
        }
        })
    })
        // console.log('RESULTS ARE ', results)
    

  }
}

module.exports = Events;