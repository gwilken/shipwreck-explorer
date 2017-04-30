$(document).ready(function() {

  console.log('index.js');

var nav = $('#sideNav');


$('#openNav').on('click', function() {
    nav.css('width', '30%');
  });


$('#closeNav').on('click', function() {

  nav.css('width', "0%");

});


  var map = L.map('map').setView([34, -118.5], 7);
  L.esri.basemapLayer('Oceans').addTo(map);


  var name = "<b>HOLLYWOOD STAR</b>";

  var description = "H11883/2008--AWOIS 50303 is a wreck charted at position 33-59-48.03N, 118-31-15.28W with a least depth of 42ft. Full multibeam coverage was acquired over AWOIS 50303. New position and depth was determined to be 33-59-48.60N, 118-31-13.20W with a least depth of 60ft. (ETR 07/21/09)NM DATED 6/13/49 DESCRIPTION 24 NO.1053; SUNK 2/14/42; POS. ACCURACY WITHIN 1 MILE; LEAST DEPTH 42 FT. (SOURCE UNK.); POS. 33-59-53N, 118-31-12W SURVEY REQUIREMENT INFORMATION";


  var marker = L.marker([33.996833, -118.520333]).addTo(map);

  marker.bindPopup(name + '<br><br>' + description);


  $.ajax({

   url: 'http://127.0.0.1/string',
   method: 'GET',
   data: {
     string: 'submarine'
   }

  }).done(function(res) {


    for(var i = 0; i < res.length; i++) {
    
      var marker = L.marker( [ res[i].geometry.coordinates[1], res[i].geometry.coordinates[0] ]).addTo(map);
      marker.bindPopup(res[i].properties.vesslterms + '<br><br>' + res[i].properties.history);
    
    }

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

$.ajax({

	url: 'http://127.0.0.1/id',
	method: 'GET',
	data: {
		id: "59038085f857488a9a719176"
	}

}).done(function(res) {

	console.log(res);

});


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
