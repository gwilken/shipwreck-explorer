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



app.get('/all', function (req, res) {

  console.log('hit all route');


  collection.find().toArray( function( err, docs) {

      resultsArr.push(docs);

    });

    res.send(resultsArr);


});


app.get('/name', function (req, res) {

  console.log('hit name route');


  var shipName = req.query.name;


  resultsArr = collection.find({

      "properties" : {
        "vesslterms" : name
      }
    },
    {
    }).toArray();

  resultsArr.then(function(arg) {

    console.log(args);

    res.send(args);

  })


})


app.get('/proximity', function (req, res) {

  console.log('hit proximity route');

 	var lat = parseFloat(req.query.lat);
	var lon = parseFloat(req.query.lon);
	var radius = parseFloat(req.query.radius);

	console.log('query: ', lat, lon, radius);


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

    console.log(arg);

    // res.setHeader({

    //   "Access-Control-Allow-Origin" : "*"
    
    // });

    res.send(arg);

});

      
//console.log(resultsArr);

})
         




// app.get('/date', function (req, res) {

//   mongoFetch(req.query.type, req.query.field, req.query.subfield, req.query.time, function(err, data) {

//     res.send(data);

//   });

// });


// app.get('/name', function (req, res) {

//   mongoFetch(req.query.type, req.query.field, req.query.subfield, req.query.time, function(err, data) {

//     res.send(data);

//   });

// });


// app.get('/notes', function (req, res) {

//   mongoFetch(req.query.type, req.query.field, req.query.subfield, req.query.time, function(err, data) {

//     res.send(data);

//   });

// });

  mongo.connect(DB_STRING, function(err, db) {
    
    if(err) console.log('Error connection to MongoDB', err);
    
    console.log('Connected to MongoDb at', DB_STRING);

    collection = db.collection(DB_COLLECTION);
  
    global_db = db;
  
  });




// function mongoFetch(msgtype, field, subfield, dur, callback) {    //time in minutes
  
//     var startTime = Date.now() - (dur * 60000);     
      
//       collection.find( 
//             { createdAt: {  $gt: startTime  }, 
            
//             type: msgtype 
//             },
//             { _id: 0, 
//               createdAt: 1, 
//               [field]: 1  
//             }
//             ).toArray( function( err, docs) {
//                 if(err) callback(err, docs);
//                 else {  
//                     var data_obj = {
//                       time: docs.map(function(doc) { return doc.createdAt; }),
//                       data: docs.map(function(doc) { return doc[field][subfield]; })
//                       }
//                     callback(null, data_obj);
//                   }
//               });

//  };
