var articles = [];

var timesKey = "44c44dc78c634b63b56fcceefdbc86ef";

var timesURLBase = "https://api.nytimes.com/svc/search/v2/articlesearch.json?api-key=" +
  timesKey + "&q=";

function timesQuery(searchTerm, start, end){
	let timesURL = timesURLBase;
	timesURL += searchTerm;

	return $.ajax({
		url: timesURL,
		method: "GET",
		data: {
			startDate: start,
			endDate: end
		}
	});
}

function congressQuery(searchTerm){
	let congressURL = "https://loc.gov/pictures/search/";
	let query = searchTerm.trim();
	return $.getJSON(congressURL, {
		type: "search",
		q: query.replace(/ /g, "%20"),
		fo: 'json'
	});
}

function wikiQuery(searchTerm){
	let wikiURL = "https://en.wikipedia.org/w/api.php?action=opensearch&search=" + searchTerm + "&format=json&callback=?";
	return $.ajax( {
	    url: wikiURL, 	    
	    type: 'GET',
	    dataType: 'json',
	    data: function(data, status, jqXHR){
	    	console.log(data);
	    }
	});
}











