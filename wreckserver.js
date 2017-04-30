

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
  console.log('local dev env!!!');
});

app.set('port', WEBPORT);

app.use(express.static(path.join(__dirname, 'public')));



app.get('/id', function (req, res) {

  console.log('hit id endpoint');

  var qId = new ObjectID(req.query.id);

  console.log('qid:', qId);

  collection.findOne( { _id : qId }, function(err, doc) {

    console.log('error', err);

    console.log('doc', doc);


    res.send(doc);


  })


})


// app.get('/string', function (req, res) {

//   var str = req.query.string;

//   resultsArr = collection.find(
    
//     {
//       $text:
      
//       { 
//         $search: str 
//       }
    
//     }
//     ).toArray();

//   resultsArr.then(function(arr) {

//     res.send(arr);

//   })

// })


app.get('/all', function (req, res) {


  collection.find().toArray( function( err, docs) {

      resultsArr.push(docs);

    });

    res.send(resultsArr);

});


app.get('/range', function (req, res) {

  console.log('range endpoint hit');

  var before = parseInt(req.query.before);
  var after = parseInt(req.query.after);

  resultsArr = collection.find(
    {
      "properties.yearsunk": { $gt: after, $lt: before }
    }
    ).toArray();

  resultsArr.then(function(arr) {

    console.log(arr);

    res.send(arr);

  })

})


app.get('/wreck', function(req, res) {

  console.log('hit wreck endpoint');


  var query = {};

  if(req.query.before && req.query.after) {

    var before = parseInt(req.query.before);
    var after = parseInt(req.query.after);

    var field = 'properties.yearsunk';

    var operator = {};
     
    operator['$lt'] = before;
    operator['$gt'] = after;

    query[field] = operator;

  }

  if(req.query.before && !req.query.after) {
    
    var before = parseInt(req.query.before);
    var field = 'properties.yearsunk';

    var operator = {};
    operator['$lt'] = before;

    query[field] = operator;

  }

  if(req.query.after && !req.query.before) {
    
    var after = parseInt(req.query.after);
    var field = 'properties.yearsunk';

    var operator = {};
    operator['$gt'] = after;

    query[field] = operator;

  }


  if(req.query.location.lat && req.query.location.lon && req.query.location.radius) {
    
    var field = 'geometry';

    var operator1 = {};
    var operator2 = {};
    var operator3 = {};

    operator3['type'] = "Point";
    operator3['coordinates'] = [ parseFloat(req.query.location.lon), parseFloat(req.query.location.lat) ];

    operator2['$geometry'] = operator3;

    operator2['$maxDistance'] = parseFloat(req.query.location.radius);

    operator1['$near'] = operator2;

    query[field] = operator1;

  };


  if(parseInt(req.query.hasName) === 1) { 

    var field = 'properties.vesslterms';

    var operator = {};
    operator['$nin'] = ["", "UNKNOWN", "WRECK"];

    query[field] = operator;

  };

  
  if(req.query.name){
  
    var field = 'properties.vesslterms';

    query[field] = req.query.name;
  
  }


  resultsArr = collection.find(query).toArray();


  resultsArr.then(function(arr) {

    res.send(arr);

  })

})


app.get('/hasname', function (req, res) {


  resultsArr = collection.find(
    {
      "properties.vesslterms" : { $nin: ["", "UNKNOWN", "WRECK"] }   
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


