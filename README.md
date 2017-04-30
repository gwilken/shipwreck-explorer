# Wrecked


API endpoints and definitions:


/wreck

A multi query endpoint. You can specifiy any of the fields to filter returns. See other endpoints for specfics on data fields. To return a single known wreck use /id. To return a known wreck(s) by name use /name

	$.ajax({
		url: 'http://www.rednightsky.com/wreck',
		method: 'GET',
		
		data: {

			location: {
		      lat: 33.998014,
		      lon: -118.823274,
		      radius: 500000	
	    	},

	    	before: '1945',
	    	after: '1900',

	    	hasName: 1,

	    	string: 'Sailing'

		}
	})}



/proximity

Will return wrecks within a given radius (in meters) of a latitude and longitude position.

	$.ajax({
		url: 'http://www.rednightsky.com/proximity',
		method: 'GET',
		data: {
			lat: 33.998014,
			lon: -118.823274,
			radius: 50000
		}
	})}


/string

Will return all wrecks that match the given string within their historical description field. Many wrecks have historical information. Case insensitive.

	$.ajax({
		url: 'http://www.rednightsky.com/string',
		method: 'GET',
		data: {
			string: "Wooden"
		}
	})}


/id

Will return one wreck matching the unique ID.

	$.ajax({
	 	url: 'http://www.rednightsky.com/id',
	 	method: 'GET',
	 	data: {
	 		id: "59038085f857488a9a719176"
	 	}
	 })


/range

Will return wrecks sunk within the range (in years) if data available (many wrecks do not have sunk dates)

	$.ajax({
		url: 'http://www.rednightsky.com/range',
		method: 'GET',
		data: {
			before: '1950',
			after: '1900'
		}
	})


/hasname

Will return all wrecks that have a name in the database (many do not)

	$.ajax({

		url: 'http://www.rednightsky.com/hasname',
		method: 'GET'
	})


/name

Will return wreck(s) that match the vessel name, case insensitive

	$.ajax({
		url: 'http://www.rednightsky.com/name',
		method: 'GET',
		data: {
			name: 'AMAZON'
		}
	})


/all

Will return all the wrecks in the database (17,000+).
	
	$.ajax({
		url: 'http://www.rednightsky.com/all',
		method: 'GET',
	})




