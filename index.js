$(document).ready(function() {

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

	url: '/id',
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
