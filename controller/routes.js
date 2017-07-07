const mongo = require('../model/mongo.js');
var test = require('assert');
const ObjectID = require('mongodb').ObjectID;

var router = function(app) {

  var resultsArr = [];

  app.get('/id', function (req, res) {
    var qId = new ObjectID(req.query.id);
    resultsArr = mongo.collection.find( { _id : qId } ).toArray();

    resultsArr.then(function(arr) {
      res.send(arr);
    })
  })

  app.get('/favs', function (req, res) {
    var ids = [];
    ids = req.query.ids.map((element) => {
      return ObjectID(element);
    })

    resultsArr = mongo.collection.find({
      _id: {
        $in: ids
        }
    }).toArray();

    resultsArr.then(function(arr) {
      res.send(arr);
    })
  })

  app.get('/string', function (req, res) {
    var re = req.query.string;
    var query = {};
    var field = 'properties.history';
    var operator = {};

    operator['$regex'] = re;
    operator['$options'] = 'i';

    query[field] = operator;

    resultsArr = mongo.collection.find(query).toArray();

    resultsArr.then(function(arr) {
      res.send(arr);
    })
  })

  app.get('/all', function (req, res) {
    mongo.collection.find().toArray( function( err, docs) {
      resultsArr.push(docs);
    });
    res.send(resultsArr);
  });

  app.get('/range', function (req, res) {
    var before = parseInt(req.query.before);
    var after = parseInt(req.query.after);

    resultsArr = mongo.collection.find(
      {
        "properties.yearsunk": { $gt: after, $lt: before }
      }
      ).toArray();

    resultsArr.then(function(arr) {
      res.send(arr);
    })
  })

  app.get('/wreck', function(req, res) {
    var query = {};

    if(req.query.string) {
      var re = req.query.string;
      var field = 'properties.history';

      var operator = {};

      operator['$regex'] = re;
      operator['$options'] = 'i';

      query[field] = operator;
    }

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

    resultsArr = mongo.collection.find(query).toArray();

    resultsArr.then(function(arr) {
      res.send(arr);
    })
  })


  app.get('/hasname', function (req, res) {
    resultsArr = mongo.collection.find(
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

    resultsArr = mongo.collection.find(
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

    var resultsArr = mongo.collection
      .find({
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
      {})
      .toArray();

    resultsArr.then(function(arg) {
      res.send(arg);
    });
  })
};

module.exports = router;
