// Unit 17 | Assignment - Visualizing Earthquakes Data with Leaflet 
// Logic javascript for Cluster map
// Create a map object
var clusterMap = L.map("mapCluster", {
  center: [
    40.574326, -105.414325
  ],
  zoom: 5
});
// Adding tile layer to the map
L.tileLayer("https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}", {
  attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
  maxZoom: 18,
  id: "mapbox.streets",
  accessToken: API_KEY
}).addTo(clusterMap);

// Store our API endpoint inside queryUrl
var queryUrl = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_month.geojson";

// Grab the data with d3

d3.json(queryUrl, function (response) {

  // Create a new marker cluster group
  var markers = L.markerClusterGroup();

  // Loop through data
  var responseData = response.features;
  //console.log(responseData);
  responseLength = responseData.length;
  //console.log(responseLength);
  for (var i = 0; i < responseLength; i++) {
    // Set the data location property to a variable
    var location = responseData[i].geometry.coordinates;
    var coordinates = [location[1], location[0]];
    var place = responseData[i].properties.place;

    // Check for location property
    if (responseData) {
      // Add circles to map
      markers.addLayer(L.marker(coordinates).bindPopup(place));
    }
  }
  // Add our marker cluster layer to the map
  clusterMap.addLayer(markers);
});
//----------End of logic_basic javascript ---------------