const express   = require('express');
const app       = express();
const http      = require('http');
const server    = http.createServer(app);
const path      = require('path');

var mongo       = require('mongodb').MongoClient, test = require('assert');
const ObjectID  = require('mongodb').ObjectID;

var WEBPORT     = 80;

var DB_STRING           = 'mongodb://127.0.0.1:27017';
var DB_COLLECTION       = 'geoJSON';
var collection;


server.listen(WEBPORT, function listening() {
  console.log('Web server listening on port %d', server.address().port);
});

app.set('port', WEBPORT);
app.use(express.static(path.join(__dirname, '/public')));



// {}


app.get('/mongo', function (req, res) {

  mongoFetch(req.query.type, req.query.field, req.query.subfield, req.query.time, function(err, data) {

    res.send(data);

  });

});


  mongo.connect(DB_STRING, function(err, db) {
    
    if(err) console.log('Error connection to MongoDB', err);
    
 
  
    collection = db.collection(DB_COLLECTION);
  
    global_db = db;
  
  });




function mongoFetch(msgtype, field, subfield, dur, callback) {    //time in minutes
  
    var startTime = Date.now() - (dur * 60000);     
      collection.find( 
            { createdAt: {  $gt: startTime  }, 
            
            type: msgtype 
            },
            { _id: 0, 
              createdAt: 1, 
              [field]: 1  
            }
            ).toArray( function( err, docs) {
                if(err) callback(err, docs);
                else {  
                    var data_obj = {
                      time: docs.map(function(doc) { return doc.createdAt; }),
                      data: docs.map(function(doc) { return doc[field][subfield]; })
                      }
                    callback(null, data_obj);
                  }
              });

 };
