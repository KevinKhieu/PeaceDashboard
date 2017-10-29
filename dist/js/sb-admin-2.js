/*!
 * Start Bootstrap - SB Admin 2 v3.3.7+1 (http://startbootstrap.com/template-overviews/sb-admin-2)
 * Copyright 2013-2016 Start Bootstrap
 * Licensed under MIT (https://github.com/BlackrockDigital/startbootstrap/blob/gh-pages/LICENSE)
 */
$(function() {
    $('#side-menu').metisMenu();
});

var dorm_data = null;
var dorm_cumulative_data = null;
var gender_data = null;
var gender_cumulative_data = null;

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
        resize: true
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
        resize: true
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
        resize: true
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
        resize: true
    });
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
            console.log(dorm_data);
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
        url : "/dorm/cumulative",
        type: "GET",
        contentType: "application/json; charset=utf-8",
        success: function(data){
            gender_data = data;
            console.log(dorm_data);
            Morris.Line({
                element: 'morris-area-chart2',
                data: JSON.parse(dorm_data),
                xkey: 'Day',
                ykeys: ['Friendships made'],
                labels: ['Cross-Gender Friendships'],
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
    // var element = $('ul.nav a').filter(function() {
    //     return this.href == url;
    // }).addClass('active').parent().parent().addClass('in').parent();
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
