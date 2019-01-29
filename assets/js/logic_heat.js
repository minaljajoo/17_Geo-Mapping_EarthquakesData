// Unit 17 | Assignment - Visualizing Earthquakes Data with Leaflet 
// Logic javascript for heat map
// Create a map object
var heatMap = L.map("mapHeat", {
  center: [
    40.574326, -105.414325
  ],
  zoom: 3
});
var light = L.tileLayer("https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}", {
  attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
  maxZoom: 18,
  id: "mapbox.light",
  accessToken: API_KEY
}).addTo(heatMap);

// Store our API endpoint inside queryUrl
var queryUrl = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_month.geojson";

// Grab the data with d3

d3.json(queryUrl, function (response) {
  // Loop through data
  var responseData = response.features;
  //console.log(responseData);
  var heatArray = [];
  responseLength = responseData.length;
  //console.log(responseLength);
  for (var i = 0; i < responseLength; i++) {
    // Set the data location property to a variable
    var location = responseData[i].geometry.coordinates;
    var coordinates = [location[1], location[0], location[2]];

    // Check for location property
    if (location) {
      // Add circles to map
      heatArray.push(coordinates)
    }
  }

  var heat = L.heatLayer(heatArray, {
    radius: 20,
    blur: 15,
    maxZoom: 10,
    max: 4.0,
    // the maximum opacity (the value with the highest intensity will have it)
    maxOpacity: .9,
    // minimum opacity. any value > 0 will produce 
    // no transparent gradient transition
    minOpacity: .3,
    gradient: {
      // for gradient color customization

      '.2': "#cc3300",
      '.4': "#ff9900",
      '.6': "#ffcc66",
      '.75': "#ffff00",
      '.8': "#ccff66",
      '.9': "#99cc00"
    }
  }).addTo(heatMap);
});

//----------End of heat map  javascript ---------------