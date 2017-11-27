var fs = require("fs");
var d3 = require("d3");
var lo = require("lodash");

var file = "./Mixed.csv";

// Converts numerical values from strings to numbers.
function convertValues(d) {
	d.Timestamp = +d.Timestamp;
	d['A ID'] = +d['A ID'];
	d['A Value'] = +d['A Value'];
	d['B ID'] = +d['B ID'];
	d['B Value'] = +d['B Value'];
}

// Reads in Peace Data csv and returns a JSON object/string with
// counts for each day by difference boundary.
fs.readFile(file, "utf8", function(error, data) {
	data = d3.csvParse(data);
	data.forEach(convertValues);
	
	var friendshipsByDay = d3.nest().key(function(d) { return d['Difference Boundary'] })
		.key(function(d) { return d['Timestamp'] })
		.rollup(function(v) { return v.length })
		.object(data);

	console.log(friendshipsByDay);
});

