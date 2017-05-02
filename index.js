$(document).ready(function() {

  var map = L.map('map').setView([34, -85], 5);
  var currentBaseMap = 'Oceans';
  var baseLayer = L.esri.basemapLayer(currentBaseMap).addTo(map);

  var markers;

  var markerMap = {};
  var markerGroup = [];

  var nav = $('#sideNav');


  $('#getLocation').on('click', function(event) {

    event.preventDefault();    

    $('#getLocation').html('Getting location...');

    var options = {
      enableHighAccuracy: true,
      timeout: 5000,
      maximumAge: 0
    };

    function success(pos) {

      $('#getLocation').html('Get My Current Location');

      var crd = pos.coords;

      $('#latitudeSearch').val(crd.latitude);
      $('#longitudeSearch').val(crd.longitude);

      var redIcon = new L.Icon({
        iconUrl: 'https://cdn.rawgit.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-red.png',
        shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
        iconSize: [25, 41],
        iconAnchor: [12, 41],
        popupAnchor: [1, -34],
        shadowSize: [41, 41]
      });

      var marker = L.marker([crd.latitude, crd.longitude], {icon: redIcon}).addTo(map);

      marker.bindPopup('<h4>My Location</h4><p><span>Latitude: ' + crd.latitude + '</span><br><span>Longitude: ' + crd.longitude + '</span></p>');

    };

    function error(err) {
      $('#getLocation').html("Can't get current location.");
      console.warn('error on get current position', err.code, err.message);
    };

    navigator.geolocation.getCurrentPosition(success, error, options);

  })


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


  $(document).on('click', '#swapMapButton', function(event) {
    
    event.preventDefault();     

    if(currentBaseMap === 'Oceans') {
      currentBaseMap = 'Imagery';
      setBasemap(currentBaseMap);

    } else {
      
      currentBaseMap = 'Oceans';
      setBasemap(currentBaseMap);

    }

  });


  map.on('dblclick', function(e) {

    var popupSearch = '<h5> Latitude: ' + e.latlng.lat + '</br> Longitude: ' + e.latlng.lng + '</h5><form id="searchPopup" class="form-inline"> <p class="help-block">Search for wrecks within</p> <div class="form-group"><input type="number" class="form-control" id="milesInput" placeholder="50 miles"><button id="popupSearchButton" type="submit" class="btn btn-primary">Go</button> </div> </form>'
    
    var popup = L.popup()
      .setLatLng(e.latlng)
      .setContent(popupSearch)
      .openOn(map);
  

    $('#popupSearchButton').on('click', function(event) {
      
      map.closePopup();

      event.preventDefault();     

      var mileRadius = $('#milesInput').val().trim();
      
      if(markers) {
        markers.clearLayers();
      }

      $('#resultsList').empty();

      markerMap = {};

      $.ajax({

        url: 'http://www.rednightsky.com/proximity',
        method: 'GET',
          data: {
            lat: e.latlng.lat,
            lon: e.latlng.lng,
            radius: mileRadius * 1609
          } 

      }).done(function(res) {

          buildMarkers(res);

          buildList(res);

        });

      }); 

  });


  function setBasemap(basemap) {
      
      console.log(baseLayer);

      if (baseLayer) {
        map.removeLayer(baseLayer);
      }

      baseLayer = L.esri.basemapLayer(basemap);

      map.addLayer(baseLayer);

    }


  var buildMarkers = function(res) {

    markerMap = {};

    markerGroup = [];


    for(var i = 0; i < res.length; i++) {
          
      var name = res[i].properties.vesslterms;
      
      var location = res[i].geometry.coordinates[1] + ',' + res[i].geometry.coordinates[0];

      var history = res[i].properties.history;

      var favButton = '<br><button id="' + res[i]._id + '" class="favorite btn btn-warning btn-sm"> <span class="glyphicon glyphicon-star-empty"> </span> Add Favorite </button>';

      var nytButton = '<button class="times articles btn btn-success btn-sm" value=' + res[i]._id + '><span class="glyphicon glyphicon-folder-open"></span> NY Times </button>';

      var wikiButton = '<button class="wiki articles btn btn-success btn-sm" value=' + res[i]._id + '><span class="glyphicon glyphicon-folder-open"></span> Wikipedia</button>';

      var locButton = '<button class="congress articles btn btn-success btn-sm" value=' + res[i]._id + '><span class="glyphicon glyphicon-folder-open"></span> LOC </button>';

      var swapoutMap = '<button id="swapMapButton" class="btn btn-warning btn-sm satButton">Toggle Base Map</button>';


      if(name === '') name = 'Not Named';

      if(history === '') history = 'No known history in database'


      var marker = L.marker( [ res[i].geometry.coordinates[1], res[i].geometry.coordinates[0] ]);

      marker.bindPopup('<h3><em>' + name + '</em></h3><h4>' + location + '</h4>' + history + favButton + swapoutMap + nytButton + wikiButton + locButton);
    
      markerGroup.push(marker);

      markerMap[res[i]._id] = marker;

    }



    markers = L.layerGroup(markerGroup);

    map.addLayer(markers);

  };


  var buildList = function(res) {

    for(var i = 0; i < res.length; i++) {
      
      var item = $('<div class="list-group-item listItem">');
      
      item.attr('value', res[i]._id);
      
      var name = $('<h3>').css('font-style', 'italic').html(res[i].properties.vesslterms);
      
      var location = $('<h4>').html(res[i].geometry.coordinates[1] + ', ' + res[i].geometry.coordinates[0]); 
      
      var desc = $('<div>').css('font-style', 'initial').html(res[i].properties.history);

      item.append(name);
      item.append(location);
      item.append(desc);

      $('#resultsList').append(item);

    }

  };


  var gotoMarker = function(id) {

     var marker = markerMap[id];

     marker.openPopup();

     map.panTo(new L.LatLng( marker.getLatLng().lat, marker.getLatLng().lng), 8);

  }


  $('#openNav').on('click', function() {
    nav.css('width', '27%');
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
    var radius = $('#radiusSearch').val().trim();

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

        buildMarkers(res);

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
                radius: radius * 1609  
              },

              name: name,

              before: before,
              after: after,

              hasName: hasName,

              string: string
          }
          }).done(function(res) {

              buildMarkers(res);

              buildList(res);

            })
      }
  })

      $(document).on("click", ".go-map", function() {
        var id = $(this).attr("data-id");

      $.ajax({

        url: 'http://www.rednightsky.com/id',
        method: 'GET',
        data: {
          id: id
        }

      }).done(function(res) {

        buildMarkers(res);

        gotoMarker(res[0]._id);

        buildList(res);

      })
        
      })


})