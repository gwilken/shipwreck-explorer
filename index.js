$(document).ready(function() {

  console.log('index.js');

  var map = L.map('map').setView([34, -85], 5);
  L.esri.basemapLayer('Oceans').addTo(map);

  var markers;

  var markerMap = {};

  var nav = $('#sideNav');


  $('#clearMarkers').on('click', function(event) {
      
      event.preventDefault();      
      markers.clearLayers();

      $('#resultsList').empty();

      markerMap = {};

  }); 


  $(document).on('click', '.listItem', function() {

     var id = $(this).attr('value');

     var marker = markerMap[id];

     marker.openPopup();

     map.panTo(new L.LatLng( marker.getLatLng().lat, marker.getLatLng().lng), 8);

  });


  map.on('dblclick', function(e) {

    var popupContent = '<h4>'+e.latlng.lat+' '+e.latlng.lng+'</h4><h5>search within x miles...</h5>';


   var popup = L.popup()
    .setLatLng(e.latlng)
    .setContent(popupContent)
    .openOn(map);
  
  });


  var gotoMarker = function(id) {

     var marker = markerMap[id];

     marker.openPopup();

     map.panTo(new L.LatLng( marker.getLatLng().lat, marker.getLatLng().lng), 8);

  }


  var buildList = function(arr) {

    for(var i = 0; i < arr.length; i++) {
      
      var item = $('<div class="list-group-item listItem">');
      item.attr('value', arr[i]._id);
      var name = $('<h3>').css('font-style', 'italic').html(arr[i].properties.vesslterms);
      var desc = $('<h5>').css('font-style', 'initial').html(arr[i].properties.history);

      name.append(desc);

      item.html(name);

      $('#resultsList').append(item);

    }

  }



  $('#openNav').on('click', function() {
    nav.css('width', '30%');
  });


  $('#closeNav').on('click', function() {
    nav.css('width', "0%");
  });



  $('#searchSubmit').on('click', function(event) {

    event.preventDefault();

    if(markers) markers.clearLayers();
  
    $('#resultsList').empty();

    markerMap = {};

    var name = $('#nameSearch').val().trim().toUpperCase();

    var string = $('#textSearch').val().trim();

    var lat = $('#latitudeSearch').val().trim();
    var lon = $('#longitudeSearch').val().trim();
    var radius = $('#radiusSearch').val().trim() * 1609;

    var after = $('#afterRangeSearch').val().trim();
    var before = $('#beforeRangeSearch').val().trim();

    var hasName = $('#hasName').prop('checked');
    var hasHistory = $('#hasHistory').prop('checked');

    var id = $('#idSearch').val().trim();


    if(id) {

      $.ajax({

        url: 'http://www.rednightsky.com/id',
        method: 'GET',
        data: {
          id: id
        }

      }).done(function(res) {

        console.log(res);

        markerMap = {};

        var markerGroup = [];

        var marker = L.marker( [ res.geometry.coordinates[1], res.geometry.coordinates[0] ]);

        marker.bindPopup('<h3><em>' + res.properties.vesslterms +'</em></h3>' + res.properties.history);
    
        markerGroup.push(marker);

        markerMap[res._id] = marker;

        markers = L.layerGroup(markerGroup);

        map.addLayer(markers);

        buildList(res);

      })
    
    } else 

      {

        $.ajax({
          url: 'http://www.rednightsky.com/wreck',
          method: 'GET',
          data: {

            location: {
                lat: lat,
                lon: lon,
                radius: radius  
              },

              name: name,

              before: before,
              after: after,

              hasName: hasName,

              string: string
          }
          }).done(function(res) {

                markerMap = {};

                var markerGroup = [];

                for(var i = 0; i < res.length; i++) {
                
                  var marker = L.marker( [ res[i].geometry.coordinates[1], res[i].geometry.coordinates[0] ]);
                  marker.bindPopup('<h3><em>' + res[i].properties.vesslterms +'</em></h3>' + res[i].properties.history);
                
                  markerGroup.push(marker);

                  markerMap[res[i]._id] = marker;

                }

                markers = L.layerGroup(markerGroup);

                map.addLayer(markers);

                buildList(res);

            })

      }
      
  })





  // $.ajax({

  //  url: 'http://www.rednightsky.com/string',
  //  method: 'GET',
  //  data: {
  //    string: 'submarine'
  //  }

  //   }).done(function(res) {

  //     markerMap = {};

  //     var markerGroup = [];

  //     for(var i = 0; i < res.length; i++) {
      
  //       var marker = L.marker( [ res[i].geometry.coordinates[1], res[i].geometry.coordinates[0] ]);
  //       marker.bindPopup('<h3><em>' + res[i].properties.vesslterms +'</em></h3>' + res[i].properties.history);
      
  //       markerGroup.push(marker);

  //       markerMap[res[i]._id] = marker;

  //     }

  //     markers = L.layerGroup(markerGroup);

  //     map.addLayer(markers);

  //     buildList(res);

  // });




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
