const mongoClient = require('mongodb').MongoClient;

var url = 'mongodb://127.0.0.1:27017/test';
var mongo = {};

module.exports = {

  connect: function(callback) {

    mongoClient.connect(url, function(err, db) {
      console.log("Connected successfully to mongodb");
      module.exports.db = db;
      module.exports.collection = db.collection('wrecks');
      callback();
    });
  }

};
