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

    $(document).on("click", ".sign-in", function() {

        event.preventDefault();
        database.ref("/toggle").set(true);

        email = $(".email").val();
        email = email.replace(".", "_");
        console.log(email);

        database.ref("/users/" + email).on("value", function(test) {
            if (test.val() === null) {

                database.ref("/users").push(email);

            } else {
                pullFavorites();
            }
        })
    })

    function pullFavorites() {
        $(".favorites").empty().append("<span>Favorites:</span");

        database.ref("/users/" + email).on("child_added", function(res) {
            console.log(res);
            var p = $("<p>").attr("class", "fav-wreck");
            var name = "<p>Name: " + res.val().name + "</p>";
            var lat = "<p>Lat: " + res.val().latitude + "</p>";
            var lng = "<p>Lon: " + res.val().longitude + "</p>";
            var history = "<p>History: " + res.val().history + "</p>";
            console.log(name);
            p.append(name).append(history).append(lat).append(lng);
            $(".favorites").append(p);

        })
    }


    $(document).on("click", ".favorite", function() {

        id = $(this).attr("id");

        database.ref("/toggle").on("value", function(response) {

            console.log(response.val());
            if (response.val() === true) {

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
                    console.log(name+lat+lng+his);
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


    $(".email").focus(function() {
        $(this).attr("value", "");
    })
    $(".email").blur(function() {
        $(this).attr("value", "example@gmail.com");
    })


})