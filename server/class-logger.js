class Logger {
  constructor(tag = ['auction'], col = global.db.collection('logs')) {
    this.tag = tag;
    this.col = col;
  }

  save(action, data) {
    return this.col.insertOne({ tag: this.tag, date: new Date(), action, data }).catch((err) => console.log(err));
  }

  findAction(action, option = {}) {
    return this.col.find({ action, ...option }).toArray();
  }


  aggregate(options) {
    //if(!Array.isArray(options))
    return this.col.aggregate(options).toArray();
  }
}

module.exports = Logger;