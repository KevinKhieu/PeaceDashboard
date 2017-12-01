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
            console.log('yey');
        }

    }
    request.open('POST','/api/csv', true);
    //request.setRequestHeader('Content-type', 'multipart/form-data'); //----(*)
    request.send(formData);
}

function uploadedFileChange() {
    var csv=document.getElementById('csvUploader').files[0];
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
        url : "/peace_data",
        type: "GET",
        contentType: "application/json; charset=utf-8",
        success: function(data) {
            peace_data = data;
            console.log(peace_data);
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
