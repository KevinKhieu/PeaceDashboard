/*!
 * Start Bootstrap - SB Admin 2 v3.3.7+1 (http://startbootstrap.com/template-overviews/sb-admin-2)
 * Copyright 2013-2016 Start Bootstrap
 * Licensed under MIT (https://github.com/BlackrockDigital/startbootstrap/blob/gh-pages/LICENSE)
 */
$(function() {
    $('#side-menu').metisMenu();
});

var formData = new FormData();
var dorm_data = null;
var dorm_cumulative_data = null;
var gender_data = null;
var gender_cumulative_data = null;

function UploadCSV() {
    var csv=document.getElementById('csvUploader').files[0];
    var formData=new FormData();
    formData.append('uploadCsv', csv);
    var request = new XMLHttpRequest();    
    request.onreadystatechange = function (){
        if(request.readyState === XMLHttpRequest.DONE && request.status === 200) {
            showGraphOptions();
            document.getElementById('myModal').style.display = "none";
        }
    }
    request.open('POST','/api/csv', true);
    //request.setRequestHeader('Content-type', 'multipart/form-data'); //----(*)
    request.send(formData);
}
var file = null;
function uploadedFileChange() {
    var csv=document.getElementById('csvUploader').files[0];
    function readFile() {
        var reader = new FileReader();
        reader.onload = function () {
            console.log(reader.result);
        };
        // start reading the file. When it is done, calls the onload event defined above.
        reader.readAsBinaryString(csv);
    }
   // readFile();
   file = csv;
    var status = document.getElementById('status');
    status.innerHTML = csv.name
}

function changeToGenderCumulative() {
    document.getElementById('morris-area-chart2').innerHTML = '';
    Morris.Area({
        element: 'morris-area-chart2',
        data: JSON.parse(gender_cumulative_data),
        xkey: 'Day',
        ykeys: ['Friendships made'],
        labels: ['Male-Female Friendships (Cumulative)'],
        pointSize: 2,
        hideHover: 'auto',
        resize: false
    });
}

function changeToGender() {
    document.getElementById('morris-area-chart2').innerHTML = '';
    Morris.Line({
        element: 'morris-area-chart2',
        data: JSON.parse(gender_data),
        xkey: 'Day',
        ykeys: ['Friendships made'],
        labels: ['Male-Female Friendships'],
        pointSize: 2,
        hideHover: 'auto',
        resize: false
    });
}

function changeToDorm() {
    document.getElementById('morris-area-chart').innerHTML = '';
    Morris.Line({
        element: 'morris-area-chart',
        data: JSON.parse(dorm_data),
        xkey: 'Day',
        ykeys: ['Friendships made'],
        labels: ['Cross-Dorm Friendships'],
        pointSize: 2,
        hideHover: 'auto',
        resize: false
    });
}

function changeToDormCumulative() {
    document.getElementById('morris-area-chart').innerHTML = '';
    Morris.Area({
        element: 'morris-area-chart',
        data: JSON.parse(dorm_cumulative_data),
        xkey: 'Day',
        ykeys: ['Friendships made'],
        labels: ['Cross-Dorm Friendships (Cumulative)'],
        pointSize: 2,
        hideHover: 'auto',
        resize: false
    });
}

function showGraphOptions(){
    pageId = 1;
    document.getElementById("graphOptions").style.display="initial";
    document.getElementById("calendar").style.display = "initial";
    document.getElementById("linegraph").style.display = "initial";
    document.getElementById("Launchpage").style.display="none";
    document.getElementById("calendarimage").style.display = "initial";
    document.getElementById("linegraphimage").style.display = "initial";
}

function goBackToLaunch(){
    document.getElementById("Launchpage").style.display="initial";
    document.getElementById("graphOptions").style.display="none";
}

function backBtnClick() {
    //function() {
        //document.getElementById("calendar").style.display = "none";
        // showGraphOptions();
    document.getElementById("graphOptions").style.display="initial";
    document.getElementById("Launchpage").style.display="none";
    document.getElementById("calendar").style.display = "initial";
    document.getElementById("linegraph").style.display = "initial";
    document.getElementById("calendarimage").style.display = "initial";
    document.getElementById("linegraphimage").style.display = "initial";
   // }
}

var backButton = function() {
    goBackToLaunch();
}

backButton.type = 'function';

var pageId = 0;
function backButtonClick() {
    if (pageId == 0) return;
    if (pageId == 1) backButton();
    if (pageId == 2) {
        backBtnClick();
    }
}
function displayGraph(id){
    pageId = 2;
    var backBtn = document.getElementById('back');
    backButton = backBtnClick();
    console.log(backBtn);
    //backBtn.addEventListener("click", backBtnClick(), true);
    if(id === 'calendar'){
        document.getElementById("calendar").style.display = "initial";
        document.getElementById("linegraph").style.display = "none";
        document.getElementById("calendarimage").style.display = "none";
        var width = 960,
            height = 136,
            cellSize = 17;

        var formatPercent = d3.format(".1%");

        var color = d3.scaleQuantize()
            .domain([-0.05, 0.05])
            .range(["#a50026", "#d73027", "#f46d43", "#fdae61", "#fee08b", "#ffffbf", "#d9ef8b", "#a6d96a", "#66bd63", "#1a9850", "#006837"]);

        var svg = d3.select("body")
          .selectAll("svg")
          .data(d3.range(1990, 2011))
          .enter().append("svg")
            .attr("width", width)
            .attr("height", height)
          .append("g")
            .attr("transform", "translate(" + ((width - cellSize * 53) / 2) + "," + (height - cellSize * 7 - 1) + ")");

        svg.append("text")
            .attr("transform", "translate(-6," + cellSize * 3.5 + ")rotate(-90)")
            .attr("font-family", "sans-serif")
            .attr("font-size", 10)
            .attr("text-anchor", "middle")
            .text(function(d) { return d; });

        var rect = svg.append("g")
            .attr("fill", "none")
            .attr("stroke", "#ccc")
          .selectAll("rect")
          .data(function(d) { return d3.timeDays(new Date(d, 0, 1), new Date(d + 1, 0, 1)); })
          .enter().append("rect")
            .attr("width", cellSize)
            .attr("height", cellSize)
            .attr("x", function(d) { return d3.timeWeek.count(d3.timeYear(d), d) * cellSize; })
            .attr("y", function(d) { return d.getDay() * cellSize; })
            .datum(d3.timeFormat("%Y-%m-%d"));

        svg.append("g")
            .attr("fill", "none")
            .attr("stroke", "#000")
          .selectAll("path")
          .data(function(d) { return d3.timeMonths(new Date(d, 0, 1), new Date(d + 1, 0, 1)); })
          .enter().append("path")
            .attr("d", pathMonth);

        d3.csv("../../data/dji.csv", function(error, csv) {
          if (error) throw error;
          header = 'Close';
          var data = d3.nest()
              .key(function(d) { return d.Date; })
              .rollup(function(d) { return (d[0][header] - d[0].Open) / d[0].Open; })
            .object(csv);

          rect.filter(function(d) { return d in data; })
              .attr("fill", function(d) { return color(data[d]); })
            .append("title")
              .text(function(d) { return d + ": " + formatPercent(data[d]); });
        });

        function pathMonth(t0) {
          var t1 = new Date(t0.getFullYear(), t0.getMonth() + 1, 0),
              d0 = t0.getDay(), w0 = d3.timeWeek.count(d3.timeYear(t0), t0),
              d1 = t1.getDay(), w1 = d3.timeWeek.count(d3.timeYear(t1), t1);
          return "M" + (w0 + 1) * cellSize + "," + d0 * cellSize
              + "H" + w0 * cellSize + "V" + 7 * cellSize
              + "H" + w1 * cellSize + "V" + (d1 + 1) * cellSize
              + "H" + (w1 + 1) * cellSize + "V" + 0
              + "H" + (w0 + 1) * cellSize + "Z";
        }
    } 

    if(id === 'linegraph'){
        document.getElementById("calendar").style.display = "none";
        document.getElementById("linegraph").style.display = "initial";
        document.getElementById("linegraphimage").style.display = "none";
        

        // have a request here for getting the peace data from server
        var request = new XMLHttpRequest();    
        var peace_data;
        request.onreadystatechange = function (){
          if(request.readyState === XMLHttpRequest.DONE && request.status === 200) {
            console.log("Front end.");
            peace_data = JSON.parse(request.response);
            makeLineGraph(peace_data);
          }
        }
        request.open('GET','/peace_data', true);
        request.send();
        
        function makeLineGraph(data) {
          console.log(data);
          var margin = {top: 20, right: 80, bottom: 50, left: 50},
            // width = svg.attr("width") - margin.left - margin.right,
            // height = svg.attr("height") - margin.top - margin.bottom,
            width = 1000,
            height = 1000;
          var parseTime = d3.timeParse("%Y%m%d");
          var x = d3.scaleTime().range([0, width]),
              y = d3.scaleLinear().range([height, 0]);
          // z = d3.scaleOrdinal(d3.schemeCategory10);
          var valueline = d3.line()
            .x(function(d) { return x(d.Timestamp); })
            .y(function(d) { return y(d.length); });

          var svg = d3.select("body").append("svg")
              .attr("width", width+margin.left+margin.right)
              .attr("height", height+margin.top+margin.bottom)
            .append("g")
              .attr("transform", 
                "translate(" + margin.left + "," + margin.top + ")");

          var g = svg.append("g").attr("transform", "translate(" + margin.left + "," + margin.top + ")");

          var line = d3.line()
              .curve(d3.curveBasis)
              .x(function(d) { return x(d.Timestamp); })
              .y(function(d) { return y(d.length); });

          var xAxis = d3.axisBottom(x).ticks(5);

          var yAxis = d3.axisLeft(y).ticks(5);

            g.append("g")
                .attr("class", "axis axis--x")
                .attr("transform", "translate(0," + height + ")")
                .call(d3.axisBottom(x))
              .append("text")
                .attr("x", 10)
                // .attr("dx", "0.71em")
                .attr("fill", "#000")
                .text("Timestamp");

            g.append("g")
                .attr("class", "axis axis--y")
                .call(d3.axisLeft(y))
              .append("text")
                .attr("transform", "rotate(-90)")
                .attr("y", 10)
                // .attr("dy", "0.71em")
                .attr("fill", "#000")
                .text("Number of Friendships");

            x.domain(d3.extent(data, function(d) { return d.Timestamp; })); 
            console.log("timestamped");
            // not sure about the y domain...
            y.domain([0, d3.max(data, function(d) { return d.length; })]);    
          
            g.append("path")
              .attr("class", "line")
              .attr("d", valueline(data));

            g.append("g")
              .attr("class", "x axis")
              .attr("transform", "translate(0," + height + ")")
              .call(xAxis);

            g.append("g")
              .attr("class", "y axis")
              .call(yAxis);
        }

        //   var city = g.selectAll(".city")
        //     .data(cities)
        //     .enter().append("g")
        //       .attr("class", "city");

        //   city.append("path")
        //       .attr("class", "line")
        //       .attr("d", function(d) { return line(d.values); })
        //       .style("stroke", function(d) { return z(d.id); });

        //   city.append("text")
        //       .datum(function(d) { return {id: d.id, value: d.values[d.values.length - 1]}; })
        //       .attr("transform", function(d) { return "translate(" + x(d.value.date) + "," + y(d.value.temperature) + ")"; })
        //       .attr("x", 3)
        //       .attr("dy", "0.35em")
        //       .style("font", "10px sans-serif")
        //       .text(function(d) { return d.id; });
        // });

        // function type(d, _, columns) {
        //   d.date = parseTime(d.date);
        //   for (var i = 1, n = columns.length, c; i < n; ++i) d[c = columns[i]] = +d[c];
        //   return d;
        // }
        // var svg = d3.select("svg"),
        //     margin = {top: 20, right: 80, bottom: 30, left: 50},
        //     width = svg.attr("width") - margin.left - margin.right,
        //     height = svg.attr("height") - margin.top - margin.bottom,
        //     g = svg.append("g").attr("transform", "translate(" + margin.left + "," + margin.top + ")");


        
/*

        d3.csv("dji.csv", type, function(error, data) {
          if (error) throw error;

          var cities = data.columns.slice(1).map(function(id) {
            return {
              id: id,
              values: data.map(function(d) {
                return {date: d.date, temperature: d[id]};
              })
            };
          });

          x.domain(d3.extent(data, function(d) { return d.date; }));

          y.domain([
            d3.min(cities, function(c) { return d3.min(c.values, function(d) { return d.temperature; }); }),
            d3.max(cities, function(c) { return d3.max(c.values, function(d) { return d.temperature; }); })
          ]);

          z.domain(cities.map(function(c) { return c.id; }));

          g.append("g")
              .attr("class", "axis axis--x")
              .attr("transform", "translate(0," + height + ")")
              .call(d3.axisBottom(x));

          g.append("g")
              .attr("class", "axis axis--y")
              .call(d3.axisLeft(y))
            .append("text")
              .attr("transform", "rotate(-90)")
              .attr("y", 6)
              .attr("dy", "0.71em")
              .attr("fill", "#000")
              .text("Temperature, ºF");

          var city = g.selectAll(".city")
            .data(cities)
            .enter().append("g")
              .attr("class", "city");

          city.append("path")
              .attr("class", "line")
              .attr("d", function(d) { return line(d.values); })
              .style("stroke", function(d) { return z(d.id); });

          city.append("text")
              .datum(function(d) { return {id: d.id, value: d.values[d.values.length - 1]}; })
              .attr("transform", function(d) { return "translate(" + x(d.value.date) + "," + y(d.value.temperature) + ")"; })
              .attr("x", 3)
              .attr("dy", "0.35em")
              .style("font", "10px sans-serif")
              .text(function(d) { return d.id; });
        });
*/
        function type(d, _, columns) {
          d.date = parseTime(d.date);
          for (var i = 1, n = columns.length, c; i < n; ++i) d[c = columns[i]] = +d[c];
          return d;
        }
    }
}

function goBackToChoices(){

    document.getElementById("graphOptions").style.display="initial";
    document.getElementById("calendar").style.display = "initial";
    document.getElementById("linegraph").style.display = "initial";
}

// Click event functions (anything called by HTML) needs to be outside of the $(function().......)!!!!!
function ChangeDiv(x) {
    if (x == 0) {
        document.getElementById("test1").style.display = "none";
        document.getElementById("test").style.display = "initial";
    } else {
        document.getElementById("test1").style.display = "initial";
        document.getElementById("test").style.display = "none";
    }
}

//Loads the correct sidebar on window load,
//collapses the sidebar on window resize.
// Sets the min-height of #page-wrapper to window size
$(function() {

    // was strugglign to get ajax to work
    function changeToDorm() {
        console.log("HI2");
    }
    $.ajax({
        url : "/dorm",
        type: "GET",
        contentType: "application/json; charset=utf-8",
        success: function(data){
            dorm_data = data;
            //console.log(dorm_data);
            Morris.Line({
                element: 'morris-area-chart',
                data: JSON.parse(dorm_data),
                xkey: 'Day',
                ykeys: ['Friendships made'],
                labels: ['Cross-Dorm Friendships'],
                pointSize: 2,
                hideHover: 'auto',
                resize: true
            });
        },
        error: function (textStatus, errorThrown) {
           console.log("ERROR: " + textStatus);
        }
    }); 

    $.ajax({
        url : "/peace_data",
        type: "GET",
        contentType: "application/json; charset=utf-8",
        success: function(data) {
            peace_data = data;
            // console.log(peace_data);
            // insert some d3 display function
        }
    })
    // $.ajax({
    //     url : "/gender",
    //     type: "GET",
    //     contentType: "application/json; charset=utf-8",
    //     success: function(data){
    //         gender_data = data;
    //         console.log(dorm_data);
    //         Morris.Line({
    //             element: 'morris-area-chart2',
    //             data: JSON.parse(dorm_data),
    //             xkey: 'Day',
    //             ykeys: ['Friendships made'],
    //             labels: ['Male-Female Friendships'],
    //             pointSize: 2,
    //             hideHover: 'auto',
    //             resize: true
    //         });
    //     },
    //     error: function (textStatus, errorThrown) {
    //        console.log("ERROR: " + textStatus);
    //     }
    // }); 

    $.ajax({
        url : "/dorm/cumulative",
        type: "GET",
        contentType: "application/json; charset=utf-8",
        success: function(data){
            dorm_cumulative_data = data;
        },
        error: function (textStatus, errorThrown) {
           console.log("ERROR: " + textStatus);
        }
    }); 

    $.ajax({
        url : "/gender/cumulative",
        type: "GET",
        contentType: "application/json; charset=utf-8",
        success: function(data){
            gender_cumulative_data = data;
        },
        error: function (textStatus, errorThrown) {
           console.log("ERROR: " + textStatus);
        }
    });

    $(window).bind("load resize", function() {
        var topOffset = 50;
        var width = (this.window.innerWidth > 0) ? this.window.innerWidth : this.screen.width;
        if (width < 768) {
            $('div.navbar-collapse').addClass('collapse');
            topOffset = 100; // 2-row-menu
        } else {
            $('div.navbar-collapse').removeClass('collapse');
        }

        var height = ((this.window.innerHeight > 0) ? this.window.innerHeight : this.screen.height) - 1;
        height = height - topOffset;
        if (height < 1) height = 1;
        if (height > topOffset) {
            $("#page-wrapper").css("min-height", (height) + "px");
        }
    });

    var url = window.location;
    var element = $('ul.nav a').filter(function() {
        return this.href == url;
    }).addClass('active').parent();

    while (true) {
        if (element.is('li')) {
            element = element.parent().addClass('in').parent();
        } else {
            break;
        }
    }
});
