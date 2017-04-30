$(document).ready(function() {

  console.log('index.js');

  var map = L.map('map').setView([34, -85], 5);
  L.esri.basemapLayer('Oceans').addTo(map);



  var nav = $('#sideNav');


  $('#openNav').on('click', function() {
    nav.css('width', '30%');
  });


  $('#closeNav').on('click', function() {
    nav.css('width', "0%");
  });



  $('#searchSubmit').on('click', function(event) {

    event.preventDefault();

    var name = $('#nameSearch').val().trim();

    var lat = $('#latitudeSearch').val().trim();
    var lon = $('#longitudeSearch').val().trim();
    var radius = $('#radiusSearch').val().trim();

    var after = $('#afterRangeSearch').val().trim();
    var before = $('#beforeRangeSearch').val().trim();

    var hasName = $('#hasName').prop('checked');
    var hasHistory = $('#hasHistory').prop('checked');

    var id = $('#idSearch').val().trim();

    if(id) {

      console.log(id);

      $.ajax({
        url: '/id',
        method: 'GET',
        data: {
          id: id
        }
      }).done(function(res) {

        console.log(res);

        var marker = L.marker( [ res.geometry.coordinates[1], res.geometry.coordinates[0] ]).addTo(map);

        marker.bindPopup('<h3><em>' + res.properties.vesslterms +'</em></h3>' + res.properties.history);
    
      })
    
    }


  })





  $.ajax({

   url: '/string',
   method: 'GET',
   data: {
     string: 'submarine'
   }

    }).done(function(res) {

    
      var markerGroup = [];

    for(var i = 0; i < res.length; i++) {
    
      var marker = L.marker( [ res[i].geometry.coordinates[1], res[i].geometry.coordinates[0] ]);
      marker.bindPopup('<h3><em>' + res[i].properties.vesslterms +'</em></h3>' + res[i].properties.history);
    
      markerGroup.push(marker);

    }

    var markers = L.layerGroup(markerGroup);

    map.addLayer(markers);

  });




//EXTERNAL VERSION

  // function initMap() {
  //   var myLatLng = {lat: -25.363, lng: 131.044};

  //   var map = new google.maps.Map(document.getElementById('map'), {
  //     zoom: 4,
  //     center: myLatLng
  //   });

  //   var marker = new google.maps.Marker({
  //     position: myLatLng,
  //     map: map,
  //     title: 'Hello World!'
  //   });
  // }

 // var miles = 100 * 1609;

	// $.ajax({

	// 	url: '/proximity',
	// 	method: 'GET',
	// 	data: {
	// 		lat: 33.998014,
	// 		lon: -118.823274,
	// 		radius: 50000
	// 	}

	// }).done(function(res){

	// 	console.log(res);

	// 	});


// $.ajax({

// 	url: '/string',
// 	method: 'GET',
// 	data: {
// 		string: 'submarine'
// 	}

// }).done(function(res) {

// 	console.log(res);

// });

// $.ajax({

// 	url: 'http://127.0.0.1/id',
// 	method: 'GET',
// 	data: {
// 		id: "59038085f857488a9a719176"
// 	}

// }).done(function(res) {

// 	console.log(res);

// });


// $.ajax({

//   url: 'http://127.0.0.1/wreck',
//   method: 'GET',
//   data: {

//     location: {

//       lat: 33.998014,
//       lon: -118.823274,
//       radius: 50000

//     },
      
//       hasName: 1

//   }
// }).done(function(res) {

//   console.log(res);

//  });





//http://www.rednightsky.com/id?id=59038085f857488a9a719176

// $.ajax({

// 	url: '/range',
// 	method: 'GET',
// 	data: {
// 		before: '1950',
// 		after: '1900'
// 	}

// }).done(function(res) {

// 	console.log(res);

// });

// $.ajax({

// 	url: '/hasname',
// 	method: 'GET'

// }).done(function(res) {

// 	console.log(res);

// });


// $.ajax({

//   url: '/wreck',
//   method: 'GET',
//   data: {
//     before: '1950'
//   }

// }).done(function(res) {

//   console.log(res);

// });


// "59038084f857488a9a718543"

    // name:
    // proximity: {
    //   lat:
    //   lon:
    //   radius:
    // }



})
