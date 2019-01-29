// Unit 17 | Assignment - Visualizing Earthquakes Data with Leaflet 
// Logic_time javascript for timeDimension map
// Create a map object
var timeMap = L.map("mapTime", {
    center: [42.877742, -97.380979],
    zoom: 2.5,
    minZoom: 2.5,
    maxBounds: L.latLngBounds([90, -180], [-90, 180]),
    maxBoundsViscosity: 1,
    scrollWheelZoom: false

});
var satelliteMap = L.tileLayer("https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}", {
    attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
    maxZoom: 18,
    id: "mapbox.satellite",
    accessToken: API_KEY
}).addTo(timeMap);

// earthquake data link
var earthquakeUrl = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson"

// fault lines data link
var platesUrl = "https://raw.githubusercontent.com/fraxen/tectonicplates/master/GeoJSON/PB2002_plates.json"

// Grab the data with d3

d3.json(earthquakeUrl, function (data) {
    var quakeData = data.features;
    var timelineLayer = L.timeline(data, {
        getInterval: function (feature) {
            return {
                start: feature.properties.time,
                end: feature.properties.time + (feature.properties.mag * 1800000)
            };
        },
        pointToLayer: function (feature, latlng) {
            return new L.circle(latlng, {
                radius: feature.properties.mag * 50000,
                fillColor: getColor(feature.properties.mag),
                fillOpacity: .7,
                stroke: true,
                color: "black",
                weight: .5
            })
        },
    })

    d3.json(platesUrl, function (data) {

        var faultFeatures = data.features

        var styling = {
            "fillOpacity": 0
        }
        var faults = L.geoJSON(faultFeatures, {
            style: function (feature) {
                return styling
            }
        }).addTo(timeMap)
        var timelineControl = L.timelineSliderControl({
            formatOutput: function (date) {
                return new Date(date).toString();
            },
            duration: 60000,
            showTicks: false
        });

        timelineControl.addTo(timeMap).addTimelines(timelineLayer);

        timelineLayer.addTo(timeMap);
    })
});

var legend = L.control({
    position: 'bottomright'
});
//---------- Legend ----------
legend.onAdd = function (mymap) {

    var div = L.DomUtil.create('div', 'info legend'),
        grades = [0, 1, 2, 3, 4, 5],
        labels = [];
    div.innerHTML += '<p><u>Magnitude</u></p>'

    // loop through our density intervals and generate a label with a colored square for each interval
    for (var i = 0; i < grades.length; i++) {
        div.innerHTML +=
            '<i style="background:' + getColor(grades[i] + 1) + '"></i> ' +
            grades[i] + (grades[i + 1] ? '&ndash;' + grades[i + 1] + '<br>' : '+');
    }
    return div;
};

legend.addTo(timeMap);
//----------- Function: colors for the map and legend
function getColor(d) {
    return d > 5 ? "#cc3300" :
        d > 4 ? "#ff9900" :
        d > 3 ? "#ffcc66" :
        d > 2 ? "#ffff00" :
        d > 1 ? "#ccff66" :
        "#99cc00";
}
//----------End of logic_time javascript ---------------