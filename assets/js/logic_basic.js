// Unit 17 | Assignment - Visualizing Earthquakes Data with Leaflet 
// Logic_basic javascript for basic map

// Create a map object
var myMap = L.map("map", {
  center: [
    40.574326, -105.414325
  ],
  zoom: 5
});

var light = L.tileLayer("https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}", {
  attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
  maxZoom: 18,
  id: "mapbox.light",
  accessToken: API_KEY
}).addTo(myMap);

// Store our API endpoint inside queryUrl
var queryUrl = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_day.geojson";

// Grab the data with d3
d3.json(queryUrl, function (response) {
  // Loop through data
  var responseData = response.features;
  //console.log(responseData);
  responseLength = responseData.length;
  //console.log(responseLength);
  for (var i = 0; i < responseLength; i++) {
    // Set the data location property to a variable

    var location = responseData[i].geometry.coordinates;
    var coordinates = [location[1], location[0]];
    //console.log(coordinates);
    var radius = responseData[i].properties.mag;
    var place = responseData[i].properties.place;
    var date = new Date(responseData[i].properties.time)
    //console.log(radius);
    // Check for location property
    if (responseData) {
      // Add circles to map
      L.circle(coordinates, {
        fillOpacity: 0.85,
        color: "black",
        stroke: true,
        weight: .5,
        fillColor: getColor(radius),
        // Adjust radius
        radius: radius * 30000
      }).bindPopup("<strong>" + place + "</strong>  <br>Date: "+ date + "<br>Magnitudes: " + radius).addTo(myMap);
    }
  }
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

legend.addTo(myMap);
//----------- Function: colors for the map and legend
function getColor(d) {
  return d > 5 ? "#cc3300" :
    d > 4 ? "#ff9900" :
    d > 3 ? "#ffcc66" :
    d > 2 ? "#ffff00" :
    d > 1 ? "#ccff66" :
    "#99cc00";
}
//----------End of logic_basic javascript ---------------