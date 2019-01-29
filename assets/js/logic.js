// Unit 17 | Assignment - Visualizing Earthquakes Data with Leaflet 
// Logic javascript for dynamic map
//  satelite tile layer
var satelliteMap = L.tileLayer('https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}', {
    maxZoom: 18,
    id: 'mapbox.satellite',
    accessToken: API_KEY
});

//  light Layer
var lightMap = L.tileLayer('https://api.mapbox.com/styles/v1/racquesta/cjbqrgrdv7c8i2sp4n2am3pfk/tiles/256/{z}/{x}/{y}?access_token=pk.eyJ1IjoicmFjcXVlc3RhIiwiYSI6ImNqYWs5emMwYjJpM2EyenBsaWRjZ21ud2gifQ.af0ky4cpslCbwe--lCrjZA', {
    maxZoom: 18
});

// outdoors layer
var outdoorsMap = L.tileLayer('https://api.mapbox.com/styles/v1/racquesta/cjbqrrjqy83j52snp27di7koj/tiles/256/{z}/{x}/{y}?access_token=pk.eyJ1IjoicmFjcXVlc3RhIiwiYSI6ImNqYWs5emMwYjJpM2EyenBsaWRjZ21ud2gifQ.af0ky4cpslCbwe--lCrjZA', {
    maxZoom: 18
});

// earthquake data link
var earthquakeUrl = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson"

// fault lines data link
var platesUrl = "https://raw.githubusercontent.com/fraxen/tectonicplates/master/GeoJSON/PB2002_plates.json"

//  get request for quake data
d3.json(earthquakeUrl, function (data) {
    var earthquakeFeatures = data.features

    // save quake layer made from geojson, 
    var quakes = L.geoJSON(earthquakeFeatures, {
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
        onEachFeature: function (feature, layer) {
            layer.bindPopup("<strong>" + feature.properties.place + "</strong><br> Date:" + new Date(feature.properties.time) + "<br> Magnitude: " + feature.properties.mag)
        }
    });
    d3.json(platesUrl, function (data) {
        var faultFeatures = data.features
        var styling = {
            "fillOpacity": 0
        }
        var faults = L.geoJSON(faultFeatures, {
            style: function (feature) {
                return styling
            }
        })
        createMap(quakes, faults)
    })

});
//----- function : createMap
function createMap(quakeLayer, faultLayer) {
    var baseMaps = {
        "Outdoor Map": outdoorsMap,
        "Grayscale Map": lightMap,
        "Satelite Map": satelliteMap
    };

    var overlayMaps = {
        "Fault Lines": faultLayer,
        "Earthquakes": quakeLayer
    };
    var mymap = L.map('mapTwo', {
        center: [42.877742, -97.380979],
        zoom: 2.5,
        minZoom: 2.5,
        layers: [outdoorsMap, faultLayer, quakeLayer],
        maxBounds: L.latLngBounds([90, -180], [-90, 180]),
        maxBoundsViscosity: 1,
        scrollWheelZoom: false
    });
    //---------- Legend ----------
    var legend = L.control({
        position: "bottomright"
    });
    legend.onAdd = function () {
        var div = L.DomUtil.create("div", "info legend"),
            grades = [0, 1, 2, 3, 4, 5],
            labels = [];

        div.innerHTML += "<p><u>Magnitude</u></p>"

        // loop through our density intervals and generate a label with a colored square for each interval
        for (var i = 0; i < grades.length; i++) {
            div.innerHTML +=
                "<i style='background:" + getColor(grades[i] + 1) + "'></i> " +
                grades[i] + (grades[i + 1] ? "&ndash;" + grades[i + 1] + "<br>" : "+");
        }
        return div;
    };

    legend.addTo(mymap);
    L.control.layers(baseMaps, overlayMaps, {
        collapsed: false
    }).addTo(mymap);
}
//----------- Function: colors for the map and legend
function getColor(d) {
    return d > 5 ? "#ff471a" :
        d > 4 ? " #ff8000" :
        d > 3 ? "#ffa64d" :
        d > 2 ? "#ffe066" :
        d > 1 ? " #ddff99" :
        "#00e600";
}
//----------End of logic  javascript ---------------