/* jshint node: true */

/*
 * This builds on the webServer of previous projects in that it exports the current
 * directory via webserver listing on a hard code (see portno below) port. It also
 * establishes a connection to the MongoDB named 'cs142project6'.
 *
 * To start the webserver run the command:
 *    node webServer.js
 *
 * Note that anyone able to connect to localhost:portNo will be able to fetch any file accessible
 * to the current user in the current directory or any of its children.
 *
 * This webServer exports the following URLs:
 * /              -  Returns a text status message.  Good for testing web server running.
 * /test          - (Same as /test/info)
 * /test/info     -  Returns the SchemaInfo object from the database (JSON format).  Good
 *                   for testing database connectivity.
 * /test/counts   -  Returns the population counts of the cs142 collections in the database.
 *                   Format is a JSON object with properties being the collection name and
 *                   the values being the counts.
 *
 * The following URLs need to be changed to fetch their reply values from the database.
 * /user/list     -  Returns an array containing all the User objects from the database.
 *                   (JSON format)
 * /user/:id      -  Returns the User object with the _id of id. (JSON format).
 * /photosOfUser/:id' - Returns an array with all the photos of the User (id). Each photo
 *                      should have all the Comments on the Photo (JSON format)
 *
 */

// var mongoose = require('mongoose');
var async = require('async');

// Required for running server
var express = require('express');
var app = express();
var session = require('express-session');

// Parsing JSON requests/resonses
var bodyParser = require('body-parser');

// File reading
var fs = require("fs");
var d3 = require("d3");
var lo = require("lodash");

// Connect Database
// mongoose.connect('mongodb://localhost/peacelab');

// Example of loading the Mongoose schema for User, Photo, and SchemaInfo
// var User = require('./js/schema/user.js');
// var House = require('./js/schema/house.js');
// var Photo = require('./js/schema/photo.js');
// var SchemaInfo = require('./js/schema/schemaInfo.js');

// Example of reading file (runs at start of "node webServer.js")
// fs.readFile('./data/Gender.json', 'utf8', function (err,data) {
// 	if (err) {
//     	return console.log(err);
//   	}

// 	var index = data.indexOf('\n');
// 	var last  = 0;
// 	while (index > -1) {
// 		// Get current line of text 
// 		var line = data.substring(last, index);
// 		last = index + 1;
// 		index = data.indexOf('\n', last);
// 		var obj = JSON.parse(line)
// 		console.log(obj['A ID']);
// 	}
// });

var file = "./data/Mixed.csv";

var multer = require('multer');
var upload = multer( {inMemory: true } )

// Converts numerical values from strings to numbers.
function convertValues(d) {
  d.Timestamp = +d.Timestamp;
  d['A ID'] = +d['A ID'];
  d['A Value'] = +d['A Value'];
  d['B ID'] = +d['B ID'];
  d['B Value'] = +d['B Value'];
}


fs.readFile('./data/Dorm.json', 'utf8', function (err,data) {
	if (err) {
    return console.log(err);
  }

	var index = data.indexOf('\n');
	var last  = 0;
	while (index > -1) {
		// Get current line of text 
		var line = data.substring(last, index);
		last = index + 1;
		index = data.indexOf('\n', last);
		var obj = JSON.parse(line)
		console.log(obj['A ID']);
	}
});

// var gender_data = require("./data/Gender.json");
// console.log(gender_data);

// Can also load data from a json file. Stores as JSON object automatically :)
//var data = require('./data.json');

// We have the express static module (http://expressjs.com/en/starter/static-files.html) do all
// the work for us.
app.use(express.static(__dirname));
app.use(session({secret: 'secretKey', resave: false, saveUninitialized: false}));
app.use(bodyParser.json());


var gender_data = "[";

var peace_data = "";
app.post('/api/csv', upload.single('uploadCsv'), function(request, response) {
  data = request.file.buffer.toString();
  data = d3.csvParse(data); 
  data.forEach(convertValues);

  var friendshipsByDay = d3.nest().key(function(d) { return d['Difference Boundary'] })
    .key(function(d) { return d['Timestamp'] })
    .rollup(function(v) { return v.length })
    .object(data);

  // make each key (rn it's a date) into a value with key "Date/Timestamp"
  // make each value into a value with key "Count/Friendships Made"

  peace_data = JSON.stringify(friendshipsByDay);		

	response.status(200).end(peace_data);
});

app.get('/peace_data', function(request, response) {
  response.status(200).end(peace_data);
});



// Example of getting data from local file 
app.post('/test', function (request, response) {
	// Read in lines from simple.txt. This gets stored in the "data" variable as a string
	// Googled how to do and found this: https://stackoverflow.com/questions/6831918/node-js-read-a-text-file-into-an-array-each-line-an-item-in-the-array
	var input = fs.createReadStream('./data/Gender.json');
	var remaining = '';
	var returnString = '';
	input.on('data', function(data) {
		remaining += data;
		var index = remaining.indexOf('\n');
		var last  = 0;
		while (index > -1) {
			// Get current line of text 
			var line = remaining.substring(last, index);
			last = index + 1;
			index = remaining.indexOf('\n', last);
			var obj = JSON.parse(line)
			console.log(obj);
			returnString += line
		}

		remaining = remaining.substring(last);
	});

	input.on('end', function() {
		if (remaining.length > 0) {
			returnString += remaining
		}
		console.log(returnString);
		response.header('Content-type','application/json');
		response.header('Charset','utf8');
		response.status(200).end(returnString);
	});	
});

months = [0, 31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];


var dorm = "";
fs.readFile('./data/Dorm.json', 'utf8', function (err,data) {
	if (err) {
    	gender = "";
  	} else {
  		var returnData = [];
  		data_obj = JSON.parse(data);
  		var month = 1;
  		var curr_month_day = 1;
  		for (var i = 1; i < 366; i++) {
  			var date = '';
  			if (curr_month_day <= months[month]) {
  				date = '2010-' + month + '-' + curr_month_day;
  			} else {
  				month++;
  				curr_month_day = 1;
  				date = '2010-' + month + '-' + curr_month_day;
  			}
  			curr_month_day++;
  			returnData.push({'Day':date, 'Friendships made': data_obj[i.toString()]});
  		}
  		dorm = JSON.stringify(returnData);
  	}
});

var gender = "";
fs.readFile('./data/Cross-Gender.json', 'utf8', function (err,data) {
  if (err) {
    gender = "";
	} else {
		var returnData = [];
		data_obj = JSON.parse(data);
		var month = 1;
		var curr_month_day = 1;
		for (var i = 1; i < 366; i++) {
			var date = '';
			if (curr_month_day <= months[month]) {
				date = '2010-' + month + '-' + curr_month_day;
			} else {
				month++;
				curr_month_day = 1;
				date = '2010-' + month + '-' + curr_month_day;
			}
			curr_month_day++;
			returnData.push({'Day':date, 'Friendships made': data_obj[i.toString()]});
		}
		gender = JSON.stringify(returnData);
	}
});

app.get('/dorm', function(request, response) {
	response.status(200).end(dorm);
});
app.get('/gender', function(request, response) {
	response.status(200).end(gender);
});

// Read in Data for Dorm Cumulative when WebServer starts. 
var dorm_cumulative = "";
fs.readFile('./data/Dorm.json', 'utf8', function (err,data) {
	if (err) {
    	dorm_cumulative = [];
  	} else {
  		var returnData = [];
  		data_obj = JSON.parse(data);
  		var month = 1;
  		var curr_month_day = 1;
  		var friendships = 0;
  		for (var i = 1; i < 366; i++) {
  			var date = '';
  			if (curr_month_day <= months[month]) {
  				date = '2010-' + month + '-' + curr_month_day;
  			} else {
  				month++;
  				curr_month_day = 1;
  				date = '2010-' + month + '-' + curr_month_day;
  			}
  			friendships += data_obj[i.toString()];
  			curr_month_day++;
  			returnData.push({'Day':date, 'Friendships made': friendships});
  		}

  		dorm_cumulative = JSON.stringify(returnData);
  	}
});

var gender_cumulative = "";
fs.readFile('./data/Cross-Gender.json', 'utf8', function (err,data) {
	if (err) {
    	gender_cumulative = [];
  	} else {
  		var returnData = [];
  		data_obj = JSON.parse(data);
  		var month = 1;
  		var curr_month_day = 1;
  		var friendships = 0;
  		for (var i = 1; i < 366; i++) {
  			var date = '';
  			if (curr_month_day <= months[month]) {
  				date = '2010-' + month + '-' + curr_month_day;
  			} else {
  				month++;
  				curr_month_day = 1;
  				date = '2010-' + month + '-' + curr_month_day;
  			}
  			friendships += data_obj[i.toString()];
  			curr_month_day++;
  			returnData.push({'Day':date, 'Friendships made': friendships});
  		}

  		gender_cumulative = JSON.stringify(returnData);
  	}
});

app.get('/dorm/cumulative', function(request, response) {
	response.status(200).end(dorm_cumulative);
});

app.get('/gender/cumulative', function(request, response) {
	response.status(200).end(gender_cumulative);
});


// COMMENT THIS OUT TO RUN LOCALLY
app.set('port', (process.env.PORT || 5000));
app.listen(app.get('port'), function() {
  console.log('Node app is running on port', app.get('port'));
});

// UNCOMMENT THIS TO RUN LOCALLY
// var server = app.listen(3000, function () {
//     var port = server.address().port;
//     console.log('Listening at http://localhost:' + port + ' exporting the directory ' + __dirname);
// });
