$(document).ready(function() {

  var map = L.map('map').setView([34, -85], 5);
  map.doubleClickZoom.disable();

  var currentBaseMap = 'Oceans';
  var baseLayer = L.esri.basemapLayer(currentBaseMap).addTo(map);

  var markers;
  var markerMap = {};
  var markerGroup = [];

  var favorites = [];

  if (localStorage.getItem("favorites")) {
      favorites = JSON.parse(localStorage.getItem("favorites"));
  }


  var nav = $('#side-nav');
  $(".articles").hide();

  $('#open-nav').on('click', function() {
    nav.css('width', '27%');
  });

  $('#close-nav').on('click', function() {
    nav.css('width', "0%");
  });

  $('#clear-markers').on('click', function(event) {
      event.preventDefault();

      if(markers) {
        markers.clearLayers();
      }

      $('#results-list').empty();
      $(this).closest('form').find("input").val("");

      $('#search-hits').html('');

      markerMap = {};
  });

  $('#show-favs').on('click', function(event) {
    event.preventDefault();

    $.ajax({
      url: 'http://localhost/favs',
      method: 'GET',
      data: {
        ids: favorites
      }
    }).done(function(res) {
      if(markers) markers.clearLayers();

      $('#results-list').empty();

      markerMap = {};

      buildMarkers(res);
      buildList(res);
    })
  })


  $(document).on('click', '.list-item', function() {
     var id = $(this).attr('value');
     var marker = markerMap[id];
     marker.openPopup();
     map.panTo(new L.LatLng( marker.getLatLng().lat, marker.getLatLng().lng), 8);
  });

$(document).on('click', '.favorite-button', function(event) {
  event.preventDefault();

  id = $(this).attr("id");

  if($(this).hasClass('selected')) {
    $(this).removeClass('selected');
    $(this).html('star_border');

    if(favorites.indexOf(id) !== -1) {
      favorites.splice(favorites.indexOf(id), 1);
      localStorage.setItem("favorites", JSON.stringify(favorites));
    }

  } else {
    $(this).addClass('selected');
    $(this).html('star');
    favorites.push(id);
    localStorage.setItem("favorites", JSON.stringify(favorites));
    console.log(favorites);
  }


})

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

  $(document).on('click', '.times', function(event) {

    event.preventDefault();
    $(".articles").show();
    $(".article-plus").hide();
    $(".article-minus").show();
    $(".article-content").show();
    $(".articles").css("width", "100%");

     var id = $(this).attr('value');

    $.ajax({

      url: 'http://localhost/id',
      method: 'GET',
      data: {
        id: id
      }

    }).done(function(res) {

        var searchTerm = res[0].properties.vesslterms;

        var start = parseDescriptionDates(res[0].properties.history);

        console.log('search', searchTerm);
        console.log('date', start);

        var timesKey = "44c44dc78c634b63b56fcceefdbc86ef";

        var timesURLBase = "https://api.nytimes.com/svc/search/v2/articlesearch.json?api-key=" +
          timesKey + "&q=";

        let timesURL = timesURLBase;
        timesURL += searchTerm;

        $.ajax( {
          url: timesURL,
          method: "GET",
          data: {
            startDate: start,
            endDate: null
          }
          }).done( function(response) {
            if(response!=null){
              console.log(response);
              let articleTitles = [];
              let articleParagraphs = [];
              let articleLinks = [];

              let articleNum = response.response.docs.length;
              for(var i = 0; i < articleNum; i++){
                articleTitles[i] = response.response.docs[i].headline.main;
                articleParagraphs[i] = response.response.docs[i].lead_paragraph;
                articleLinks[i] = response.response.docs[i].web_url;

                var $titleElement = $("<h4>");
                var $paragraphElement = $("<p>");
                var $linkElement = $("<a>Full Article</a>");

                $titleElement.html(articleTitles[i]);
                $paragraphElement.html(articleParagraphs[i]);
                $linkElement.attr("href", articleLinks[i]).attr("target", "_blank");

                $("#times-content").append($titleElement).append($paragraphElement).append($linkElement).append($("<hr>"));
              }
              console.log(articleTitles, articleParagraphs, articleLinks);
            }
          });
      });

  });

  $(document).on('click', '.wiki', function(event) {

    event.preventDefault();
    $(".articles").show();
    $(".article-plus").hide();
    $(".article-minus").show();
    $(".article-content").show();
    $(".articles").css("width", "100%");

     var id = $(this).attr('value');

     console.log('wiki', id);


      $.ajax({

        url: 'http://localhost/id',
        method: 'GET',
        data: {
          id: id
        }

      }).done(function(res) {

          var searchTerm = res[0].properties.vesslterms;

          console.log(searchTerm);

          let wikiURL = "https://en.wikipedia.org/w/api.php?action=opensearch&search=" + searchTerm + "&format=json&callback=?";

          $.ajax( {
              url: wikiURL,
              type: 'GET',
              dataType: 'json',
              data: function(data, status, jqXHR) {
                console.log(data);
              }

            }).done( function(response) {
              let articleTitles = [];
              let articleParagraphs = [];
              let articleLinks = [];

              console.log(response);
              let articleNum = response[1].length;
              for(var i = 0; i < articleNum; i++){
              articleTitles[i] = response[1][i];
              articleParagraphs[i] = response[2][i];
              articleLinks[i] = response[3][i];

              var $titleElement = $("<h4>");
              var $paragraphElement = $("<p>");
              var $linkElement = $("<a>Full Article</a>");

              $titleElement.html(articleTitles[i]);
              $paragraphElement.html(articleParagraphs[i]);
              $linkElement.attr("href", articleLinks[i]).attr("target", "_blank");

              $("#wiki-content").append($titleElement).append($paragraphElement).append($linkElement).append($("<hr>"));
              }
            });
        });

  });


  $(document).on('click', '.congress', function(event) {

    event.preventDefault();
    $(".articles").show();
    $(".article-plus").hide();
    $(".article-minus").show();
    $(".article-content").show();
    $(".articles").css("width", "100%");

    var id = $(this).attr('value');

    console.log('congress', id);

   $.ajax({

        url: 'http://localhost/id',
        method: 'GET',
        data: {
          id: id
        }

      }).done(function(res) {

        let congressURL = "https://loc.gov/pictures/search/";
        let query = res[0].properties.vesslterms;

        $.getJSON(congressURL, {

          type: "search",
          q: query.replace(/ /g, "%20"),
          fo: 'json'

        }).done(function(results) {
          let articleTitles = [];
          let printLinks = [];
          let articleDescriptions = [];

          articleNum = results.results.length;
          for(var i = 0; i< articleNum; i++){
            articleTitles[i] = results.results[i].subjects[0];
            printLinks[i] = results.results[i].image.full.substring(2);
            articleDescriptions[i] = results.results[i].title;
            console.log(printLinks[i]);

            var $titleElement = $("<h4>");
            var $linkElement = $("<a>See Print</a>");
            var $descriptionElement = $("<p>");

            $titleElement.html(articleTitles[i]);
            $linkElement.attr("href", printLinks[i]).attr("target", "_blank");
            $descriptionElement.html(articleDescriptions[i]);

            $("#congress-content").append($titleElement).append($descriptionElement).append($linkElement).append($("<hr>"));
          }
        });

    });
  });

  $(document).on('click', '#clear-articles', function(){
    $("#times-content").empty();
    $("#wiki-content").empty();
    $("#congress-content").empty();
  });


  map.on('dblclick', function(e) {

    var popupSearch =

      `<h5> Positon: </h5>
      <p> ${e.latlng.lat} , ${e.latlng.lng} </p>

      <form id="searchPopup" class="form-inline">
        <h5>Search for wrecks within:</h5>

        <div class="form-group" style="margin-bottom: 6%;">
          <input type="number" class="form-control" id="milesInput" placeholder="50 miles">
            <button id="popupSearchButton" type="submit" class="btn btn-primary">Go</button>
        </div>
      </form>`;

    var popup = L.popup()
      .setLatLng(e.latlng)
      .setContent(popupSearch)
      .openOn(map);


    $('#popupSearchButton').on('click', function(event) {

      map.closePopup();
      event.preventDefault();

      $('#results-list').empty();

      var mileRadius = $('#milesInput').val().trim();

      if(markers) {
        markers.clearLayers();
      }

      markerMap = {};

      $.ajax({

        url: 'http://localhost/proximity',
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
      if (baseLayer) {
        map.removeLayer(baseLayer);
      }

      baseLayer = L.esri.basemapLayer(basemap);

      map.addLayer(baseLayer);
    }


  var buildMarkers = function(res) {
    markerMap = {};
    markerGroup = [];

    if(markers) {
        markers.clearLayers();
    }

    for(var i = 0; i < res.length; i++) {
      var name = res[i].properties.vesslterms;
      var location = res[i].geometry.coordinates[1] + ',' + res[i].geometry.coordinates[0];
      var history = res[i].properties.history;
      var db_id = res[i]._id;
      var nytButton = '<button class="times research mdl-button mdl-js-button mdl-button--raised mdl-button--colored" value=' + res[i]._id + '><span class="glyphicon glyphicon-folder-open"></span> NY Times </button>';
      var wikiButton = '<button class="wiki research mdl-button mdl-js-button mdl-button--raised mdl-button--colored" value=' + res[i]._id + '><span class="glyphicon glyphicon-folder-open"></span> Wikipedia</button>';
      var locButton = '<button class="congress research mdl-button mdl-js-button mdl-button--raised mdl-button--colored" value=' + res[i]._id + '><span class="glyphicon glyphicon-folder-open"></span> LOC </button>';
      var swapoutMap = '<button id="swapMapButton" class="mdl-button mdl-js-button mdl-button--raised mdl-button--colored satButton">Toggle View</button>';

      if(name === '') name = 'Not Named';
      if(history === '') history = 'No known history in database'

      var marker = L.marker( [ res[i].geometry.coordinates[1], res[i].geometry.coordinates[0] ]);

      marker.bindPopup(
        `<div class="ship-name"> ${name} </div>
        <hr>
         <div class="ship-position"> ${location} </div>
         <div class=ship-description> ${history} </div>
         <div class="ship-id">ID: ${db_id}</div>
            ${swapoutMap}
            <hr>
           ${nytButton} ${wikiButton} ${locButton}`
         );

      markerGroup.push(marker);

      markerMap[res[i]._id] = marker;
    }

    markers = L.layerGroup(markerGroup);
    map.addLayer(markers);
  };


  var buildList = function(res) {

    $('#search-hits').html(res.length + ' records found');

    for(var i = 0; i < res.length; i++) {

      if(favorites.includes(res[i]._id)) {
        var isSelected = 'selected';
        var favIcon = "star";
      } else {
        var isSelected = null;
        var favIcon = "star_border";
      }
      var li = $('<li class="list-item">').attr('value', res[i]._id);
      var fav = $(`<i class="material-icons favorite-button ${isSelected}" id="${res[i]._id}">${favIcon}</i>`)
      var name = $('<div class="ship-name">').html(res[i].properties.vesslterms);
      var location = $('<div class="ship-position">').html(res[i].geometry.coordinates[1] + ', ' + res[i].geometry.coordinates[0]);
      var db_id = $('<div class="ship-id">').html('ID : ' + res[i]._id);
      var desc = $('<p class="ship-description">').html(res[i].properties.history);

      li.append(name);

      li.append(fav);
      li.append('<hr>');
      li.append(location);
      li.append(desc);
      li.append(db_id);

      $('#results-list').append(li);
    }
  };


  var gotoMarker = function(id) {
     var marker = markerMap[id];
     marker.openPopup();
     map.panTo(new L.LatLng( marker.getLatLng().lat, marker.getLatLng().lng), 8);
  }

var parseDescriptionDates = function(str) {

  var dateRegEx = /((0?[1-9]|10|11|12)(-|\/)([0-9]|(0[0-9])|([12])([0-9]?)|(3[01]?))(-|\/)((\d{4})|(\d{2}))|(0?[2469]|11)(-|\/)((0[0-9])|([12])([0-9]?)|(3[0]?))(-|\/)((\d{4}|\d{2})))/g;
  var sunkRegEx = /([Ss][Uu][Nn][Kk]) ((0?[1-9]|10|11|12)(-|\/)([0-9]|(0[0-9])|([12])([0-9]?)|(3[01]?))(-|\/)((\d{4})|(\d{2}))|(0?[2469]|11)(-|\/)((0[0-9])|([12])([0-9]?)|(3[0]?))(-|\/)((\d{4}|\d{2})))/g;

  let dates = str.match(dateRegEx);

        var sinkDate = null;

        if(dates!==null){

            if(dates.length == 2){
                sinkDate = dates[0];
            }else{

                dates = str.match(sunkRegEx);
                console.log(dates);
                sinkDate = dates[0].split(" ")[1];

            }

            let dateExpansion = sinkDate.split("/");
            let sinkYear = dateExpansion[2];

            if (sinkYear.length==2){

                if(parseInt(sinkYear) < 17){
                    sinkYear = "20" + sinkYear;

                }else{

                    sinkYear = "19" + sinkYear;

                }
            }

            let sinkMonth = dateExpansion[0];

            if(sinkMonth.length==1){

                sinkMonth = "0" + sinkMonth;

            }

            let sinkDay = dateExpansion[1];

            if(sinkDay.length==1){

                sinkDay = "0" + sinkDay;

            }

            sinkDate = sinkYear + sinkMonth + sinkDay;
        }

        return(sinkDate);

}



  $('#search-submit').on('click', function(event) {

    event.preventDefault();

    if(markers) markers.clearLayers();

    $('#results-list').empty();

    markerMap = {};

    var name = $('#nameSearch').val().trim().toUpperCase();
    var string = $('#textSearch').val().trim();
    var after = $('#afterRangeSearch').val().trim();
    var before = $('#beforeRangeSearch').val().trim();
    var hasName = $('#hasName').prop('checked');
    var hasHistory = $('#hasHistory').prop('checked');
    var id = $('#idSearch').val().trim();

    if(id) {
      $.ajax({
        url: 'http://localhost/id',
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
          url: 'http://localhost/wreck',
          method: 'GET',
          data: {
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
          url: 'http://localhost/id',
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
