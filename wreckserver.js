const express   = require('express');
const app       = express();
const http      = require('http');
const server    = http.createServer(app);
const path      = require('path');
const cors      = require('cors');


app.use(cors());

var mongo       = require('mongodb').MongoClient, test = require('assert');
const ObjectID  = require('mongodb').ObjectID;

var WEBPORT     = 80;

var DB_STRING           = 'mongodb://127.0.0.1:27017/test';
var DB_COLLECTION       = 'wrecks';
var collection;

var resultsArr = [];




server.listen(WEBPORT, function listening() {
  console.log('Web server listening on port %d', server.address().port);
});

app.set('port', WEBPORT);

app.use(express.static(path.join(__dirname, 'public')));



app.get('/id', function (req, res) {

  var id = req.query.id;

  var result = collection.find(
    {
      _id: id
    }
    );

  result.then(function(doc) {

    res.send(doc);

  })

})


app.get('/all', function (req, res) {


  collection.find().toArray( function( err, docs) {

      resultsArr.push(docs);

    });

    res.send(resultsArr);


});


app.get('/range', function (req, res) {

  var before = parseInt(req.query.before);
  var after = parseInt(req.query.after);

  resultsArr = collection.find(
    {
      "properties.yearsunk": { $gt: after, $lt: before }
    }
    ).toArray();

  resultsArr.then(function(arr) {

    res.send(arr);

  })

})


app.get('/name', function (req, res) {

  var shipName = req.query.name;

  resultsArr = collection.find(
    {
      "properties.vesslterms": shipName.toUpperCase()
    }
    ).toArray();

  resultsArr.then(function(arr) {

    res.send(arr);

  })

})


app.get('/proximity', function (req, res) {

 	var lat = parseFloat(req.query.lat);
	var lon = parseFloat(req.query.lon);
	var radius = parseFloat(req.query.radius);

  var resultsArr = collection.find( 

          {
          	"geometry" : {
          		
          		$near : { 

          			$geometry : {
          			
  	        			type : "Point" ,
  	        			coordinates : [ lon, lat ]
  	        		},

          			$maxDistance : radius 
         			}

         		}

          },
          
          { 

          }
          ).toArray();

  resultsArr.then(function(arg) {

    res.send(arg);

  });

})
         


  mongo.connect(DB_STRING, function(err, db) {
    
    if(err) console.log('Error connection to MongoDB', err);
    
    console.log('Connected to MongoDb at', DB_STRING);

    collection = db.collection(DB_COLLECTION);
  
    global_db = db;
  
  });


