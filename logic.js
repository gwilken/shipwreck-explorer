var articles = [];

var timesKey = "44c44dc78c634b63b56fcceefdbc86ef";

var timesURLBase = "https://api.nytimes.com/svc/search/v2/articlesearch.json?api-key=" +
  timesKey + "&q=";

function timesQuery(searchTerm, start, end){
	let timesURL = timesURLBase;
	timesURL += searchTerm;
	if(start != null){
		timesURL+= "&begin_date=" + start + "0101";
	}
	if(end != null){
		timesURL+= "&end_date=" + end + "1231"; 
	}

	$.ajax({
		url: timesURL,
		method: "GET"
	}).done(function(response){
		for(i = 0; i < 5; i++){
			let article = response.response.docs[i];
			console.log(article);
			articles.push(article);
		}
	});
}

function timesHeadlineAt(n){
	return articles[n].headline.main;
}

function timesUrlAt(n){
	return articles[n].web_url;
}

function timesSnippetAt(n){
	return articles[n].snippet;
}

function timesPubDateAt(n){
	return articles[n].pub_date;
}



function congressQuery(searchTerm, start, end){
	$.ajax({
		type: 'get',
		url: '//loc.gov/pictures/',
		dataType:'json',
		data: {
			fo: 'jsonp',
			at: 'collections'
		},
		success: function(response){
			console.log(response)
		}
	});
}

function wikiQuery(searchTerm){
	let wikiURL = "https://en.wikipedia.org/w/api.php?action=opensearch&search=" + searchTerm + "&format=json&callback=?";
	$.ajax( {
	    url: wikiURL, 	    
	    type: 'GET',
	    dataType: 'json',
	    data: function(data, status, jqXHR){
	    	console.log(data);
	    }
	})
	.done(function(response){
		console.log(response);
	})
	.fail(function(err){
		console.log(err);
	})
	.always(function(){
		console.log("WIKIQUERY COMPLETE");
	})
}

wikiQuery("Kevin Bacon");

congressQuery("Donald Trump", null, null);








