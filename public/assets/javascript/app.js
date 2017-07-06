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
    var favToggle = false;
    var artToggle = false;

    function loggedOut() {
        $(".help-block").show();
        $(".email").show();
        $(".sign-in").show();
        $(".user-confirm").hide();
        $(".sign-out").hide();
        $("#rememberMeGroup").show();
        $(".email").attr("placeholder", "Email"); 
        $(".favorites").hide();
    }

    function loggedIn() {
        $(".help-block").hide();
        $(".email").hide();
        $(".sign-in").hide();
        $(".user-confirm").show();
        $(".sign-out").show();
        $("#rememberMeGroup").hide();
    }

    if (localStorage.getItem("email")) {
        email = localStorage.getItem("email");
        $(".email").attr("placeholder", email.replace("|", "."));
        loggedIn();
        pullFavorites();
    } else {
        loggedOut();
    }

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

        if ($("#rememberMe").prop("checked")) {
            localStorage.clear();
            localStorage.setItem("email", email);
        }
        loggedIn();
    })

    $(document).on("click", ".sign-out", function() {
        event.preventDefault();
        userToggle = false;
        localStorage.clear();
        loggedOut();
    })

    function pullFavorites() {
        $(".favorites").show();
        $(".fav-content").empty();

        database.ref("/users/" + email).on("child_added", function(res) {
            console.log(res);
            var p = $("<p>").attr("class", "fav-wreck").attr("data-fb", res.key).attr("data-lat", res.val().latitude).attr("data-lng", res.val().longitude);
            var name = "<p style='font-size: 20px'><em>" + res.val().name + "</em></p>";
            var latlng = "<p><span class='fav-label'>Lat: </span>" + res.val().latitude + "  <span class='fav-label'>Lon: </span>" + res.val().longitude + "</p>";
            var history = "<p>" + res.val().history + "</p>";
            var gomap = "<button type='button' class='go-map btn btn-info btn-sm' data-id='" + res.val().id + "'> Go </button>";
            var remove = "<button type='button' class='remove btn btn-default btn-sm'><span class='glyphicon glyphicon-trash'></span> Remove </button>";
            console.log(name);
            p.append(name).append(history).append(latlng).append(gomap).append(remove);
            $(".fav-content").append(p);

        })
    }


    $(document).on("click", ".favorite", function() {

        id = $(this).attr("id");
        var fb_id;
        var fb_array = [];

        database.ref("/users/" + email).on("child_added", function(get) {
            fb_id = get.val().id;
            fb_array.push(fb_id);
        })

            if (userToggle === true & fb_array.indexOf(id) === -1) {

                $.ajax({
                    url: 'http://www.rednightsky.com/id',
                    method: 'GET',
                    data: {
                        id: id
                    }
                }).done(function(res) {
                    console.log(res);
                    var name = res[0].properties.vesslterms;
                    var lat = res[0].geometry.coordinates[1];
                    var lng = res[0].geometry.coordinates[0];
                    var his = res[0].properties.history;
                    var id = res[0]._id;
                    console.log(name + lat + lng + his);
                    console.log(email);
                    database.ref("/users/" + email).push({
                        name: name,
                        history: his,
                        latitude: lat,
                        longitude: lng,
                        id: id
                    })
                })
                pullFavorites();
            }
    });

    $(document).on("click", ".remove", function() {
        if (userToggle === true) {
            var key = $(this).parent().attr("data-fb");
            database.ref("/users/" + email + "/" + key).remove();
            pullFavorites();
        }
    })

    $(".fav-plus").hide();
    $(".article-plus").hide();

    $(document).on("click", ".fav-heading", function() {
        if (favToggle === false) {
            $(".fav-plus").show();
            $(".fav-minus").hide();
            $(".fav-content").hide();
            $(".favorites").css("width", "30%");
            favToggle = true;
        } else {
            $(".fav-plus").hide();
            $(".fav-minus").show();
            $(".fav-content").show();
            $(".favorites").css("width", "100%");
            favToggle = false;
        }
    })

    $(document).on("click", ".article-heading", function() {
        if (artToggle === false) {
            $(".article-plus").show();
            $(".article-minus").hide();
            $(".article-content").hide();
            $(".articles").css("width", "30%");
            artToggle = true;
        } else {
            $(".article-plus").hide();
            $(".article-minus").show();
            $(".article-content").show();
            $(".articles").css("width", "100%");
            artToggle = false;
        }
    });



})