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

var mongoose = require('mongoose');
var async = require('async');




// Required for running server
var express = require('express');
var app = express();
var session = require('express-session');

// Parsing JSON requests/resonses
var bodyParser = require('body-parser');

// File reading
var fs = require("fs");

// Connect Database
mongoose.connect('mongodb://localhost/peacelab');

// Example of loading the Mongoose schema for User, Photo, and SchemaInfo
// var User = require('./js/schema/user.js');
// var House = require('./js/schema/house.js');
// var Photo = require('./js/schema/photo.js');
// var SchemaInfo = require('./js/schema/schemaInfo.js');

// Example of reading file (runs at start of "node webServer.js")
fs.readFile('simple.txt', 'utf8', function (err,data) {
	if (err) {
    	return console.log(err);
  	}
  	console.log(data);
});


// Can also load data from a json file. Stores as JSON object automatically :)
//var data = require('./data.json');

// We have the express static module (http://expressjs.com/en/starter/static-files.html) do all
// the work for us.
app.use(express.static(__dirname));
app.use(session({secret: 'secretKey', resave: false, saveUninitialized: false}));
app.use(bodyParser.json());



// Example of getting data from local file 
app.post('/test', function (request, response) {
	// Read in lines from simple.txt. This gets stored in the "data" variable as a string
	// Googled how to do and found this: https://stackoverflow.com/questions/6831918/node-js-read-a-text-file-into-an-array-each-line-an-item-in-the-array
	var input = fs.createReadStream('simple.txt');
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

var server = app.listen(3000, function () {
    var port = server.address().port;
    console.log('Listening at http://localhost:' + port + ' exporting the directory ' + __dirname);
});
