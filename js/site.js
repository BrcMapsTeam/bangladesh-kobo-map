//configuration object

let config = {
    title:"MSM",
    description: "<p><a href='#contacts'>Contacts</a></p>",
    data: //"data/data2.json",
        "https://proxy.hxlstandard.org/data.json?url=https%3A//docs.google.com/spreadsheets/d/1eJjAvrAMFLpO3TcXZYcXXc-_HVuHLL-iQUULV60lr1g/edit%23gid%3D0&strip-headers=on&force=on", //"data/data.json",

    colors:['#ef8f8f','#9a181a','#841517','#ef8f8f','#6e1113','#580e0f','#420a0b','#2c0708']
};

// hxlProxyToJSON: reading hxl tags and setting them as keys for each event
// input is an array with hxl tags as first object, and then the data as objects
// output is an array with hxl tags as keys for the data objects

function hxlProxyToJSON(input) {
    var output = [];
    var keys = []
    input.forEach(function (e, i) {
        if (i == 0) {
            e.forEach(function (e2, i2) {
                var parts = e2.split('+');
                var key = parts[0]
                if (parts.length > 1) {
                    var atts = parts.splice(1, parts.length);
                    atts.sort();
                    atts.forEach(function (att) {
                        key += '+' + att
                    });
                }
                keys.push(key);
            });
        } else {
            var row = {};
            e.forEach(function (e2, i2) {
                row[keys[i2]] = e2;
            });
            output.push(row);
        }
    });
    return output;
}



// CREATING MAP
function initDash() {
    map = L.map('map').setView([21.18757,92.14653], 18);

    L.tileLayer('https://a.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="http://openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    , maxZoom: 19, minZoom:9}).addTo(map);

    info = L.control();

    info.onAdd = function (map) {
        this._div = L.DomUtil.create('div', 'ipc-info');
        return this._div;
    };
    info.addTo(map);

    //Restricting boundaries of the map
    let bounds = L.latLngBounds([20.834427,91.209869],[21.649770,93.085785]);
    map.setMaxBounds(bounds);
    map.on('drag', function() {
    	map.panInsideBounds(bounds, { animate: false });
    });
};


initDash();


function plotData(data) {
  data.forEach(function(point, index){
    point.GPS_Way_point = point.GPS_Way_point.split(" ")
    console.log(point.GPS_Way_point[0]);

    var circle = L.circle([point.GPS_Way_point[0], point.GPS_Way_point[1]], {
    color: 'red',
    fillColor: '#f03',
    fillOpacity: 0.5,
    radius: 4,
    weight: 1
    }).addTo(map);
    let latrineText = "<p>Latrine in use: " + point.Latrine_in_use + "</p>";
    let popupText = "<p>Activity: " + point.Activity + "</p>" + latrineText;
    //<p>Photo:<img src='" + point._attachments[0].download_url + point._attachments[0].filename  +"' height='42' width='42'>";
    circle.bindPopup(popupText);
  });
};


let dataCall = $.ajax({
    type: 'GET',
    url: 'data/data.json',
    //https://kc.humanitarianresponse.info/api/v1/data/215912?format=json',
    dataType: 'json',
});


//when both ready construct 3W
$.when(dataCall).then(function (dataArgs) {
  console.log(dataArgs);
    // dataArgs[0] = hxlProxyToJSON(dataArgs[0]);
    // var geom = topojson.feature(geomArgs[0], geomArgs[0].objects.mdgAdm3);
    // console.log("test1=", geomArgs[0].objects.mdgAdm3, "test2=", geomArgs[0]);
    // //converts place codes to string
    // geom.features.forEach(function(e){
    //     e.properties[config.joinAttribute] = String(e.properties[config.joinAttribute]);
    //});
    plotData(dataArgs);
});
