$(document).ready(function() {

    // Initialize Firebase
    var config = {
        apiKey: "AIzaSyClO2Qy4M9YOUEhQHyr5aze3pEfJT4bZm0",
        authDomain: "wrecked-8c6be.firebaseapp.com",
        databaseURL: "https://wrecked-8c6be.firebaseio.com",
        projectId: "wrecked-8c6be",
        storageBucket: "wrecked-8c6be.appspot.com",
        messagingSenderId: "955956780425"
    };
    firebase.initializeApp(config);

    var database = firebase.database();

    var email;
    var userToggle = false;
    var collapseToggle = false;

    $(".favorites").hide();


    $(document).on("click", ".sign-in", function() {

        event.preventDefault();
        userToggle = true;

        email = $(".email").val();
        email = email.replace(".", "|");
        console.log(email);

        database.ref("/users/" + email).on("value", function(test) {
            console.log(test.val());
            if (test.val() != null) {
                pullFavorites();
            }
        })
    })

    /*$(document).on("click", ".sign-out", function() {
        event.preventDefault();
        userToggle = false;
        $(".confirm").hide();
        $(".email").show();
        $(".sign-in").show();
        $(".favorites").hide();
    })*/

    function pullFavorites() {
        $(".favorites").show();
        $(".fav-heading").nextAll().remove();

        database.ref("/users/" + email).on("child_added", function(res) {
            console.log(res);
            var p = $("<p>").attr("class", "fav-wreck").attr("data-fb", res.key).attr("data-lat", res.val().latitude).attr("data-lng", res.val().longitude);
            var name = "<p><span class='fav-label'>Name: </span>" + res.val().name + "</p>";
            var lat = "<p><span class='fav-label'>Lat: </span>" + res.val().latitude + "</p>";
            var lng = "<p><span class='fav-label'>Lon: </span>" + res.val().longitude + "</p>";
            var history = "<p><span class='fav-label'>History: </span>" + res.val().history + "</p>";
            var remove = "<button type='button' class='remove btn btn-default btn-sm'><span class='glyphicon glyphicon-trash'></span> Trash </button>";
            console.log(name);
            p.append(name).append(history).append(lat).append(lng).append(remove);
            $(".favorites").append(p);

        })
    }


    $(document).on("click", ".favorite", function() {

        id = $(this).attr("id");

        database.ref("/toggle").on("value", function(response) {

            console.log(response.val());
            // if (response.val() === true) {
              if (userToggle === true) {

                $.ajax({
                    url: 'http://www.rednightsky.com/id',
                    method: 'GET',
                    data: {
                        id: id
                    }
                }).done(function(res) {
                    console.log(res);
                    var name = res.properties.vesslterms;
                    var lat = res.geometry.coordinates[1];
                    var lng = res.geometry.coordinates[0];
                    var his = res.properties.history;
                    console.log(name + lat + lng + his);
                    console.log(email);
                    database.ref("/users/" + email).push({
                        name: name,
                        history: his,
                        latitude: lat,
                        longitude: lng
                    })
                })
                pullFavorites();
            }
        })
    });

    $(document).on("click", ".remove", function() {
        if (userToggle === true) {
          var key = $(this).parent().attr("data-fb");
          database.ref("/users/" + email + "/" + key).remove();
          pullFavorites();
        }
    })

    $(document).on("click", ".fav-collapse", function() {
        if (collapseToggle === false) {
            $(".fav-wreck").hide();
            $(".fav-collapse").html("Expand");
            collapseToggle = true;
        } else {
            $(".fav-wreck").show();
            $(".fav-collapse").html("Collapse");
            collapseToggle = false;
        }
    })


})