//Assign variable to url where  loading the Earthquake 
// & tectonic  Data
var earthQuakeUrl = 'https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson';

var tectonicUrl = 'Data/Plates.json';


// Call Functions to display earthQuake and Tectonic Map

displayMaps(earthQuakeUrl, tectonicUrl );

//Function to change colors depending on earthquake magnitud
function chooseColor(magnitude) {
    return magnitude > 5 ? "red":
      magnitude > 4 ? "orange":
        magnitude > 3 ? "gold":
          magnitude > 2 ? "yellow":
            magnitude > 1 ? "yellowgreen":
              "greenyellow"; // <= 1 default
  }

//Function to adjust markers according to earthquake magnitude
function markerSize(magnitude) {
    return magnitude * 5;
  }

// Functions to display maps and load data
var TectonicData = [];
var EarthQuakeData = [];

function displayMaps(earthQuakeUrl, tectonicUrl ){

// Grab Earthquake and Tectonic Data with d3
d3.json(earthQuakeUrl, function(data){
    //Store respose into EarthQuake Data 
    var EarthQuakeData = data;
    // console.log(EarthQuakeData);

d3.json(tectonicUrl, function(data){
    //Store respose into Tectonic Data 
    var TectonicData = data;
    // console.log(TectonicData)

    // Call function to createFeatures function 
    createFeatures(EarthQuakeData, TectonicData);
  });    
});

// Function to create Features
function createFeatures(EarthQuakeData, TectonicData){
    
    //Two Sepearate function for EarthQuakeData and TectonicDat  
    
    // Two additional function for markers(circle marker) a
    //a nd popup(place, time, magnitud) in EarthQuake Data 
    function onEachQuakeLayer(feature, layer) {
       
        return new L.circleMarker([feature.geometry.coordinates[1], feature.geometry.coordinates[0]], {
            fillOpacity: 1,
            color: chooseColor(feature.properties.mag),
            fillColor: chooseColor(feature.properties.mag),
            radius:  markerSize(feature.properties.mag),
            weight: 2,
            opacity: 1,
            fillOpacity: 0.6
        });
    }
    function onEachEarthquake(feature, layer) {
            layer.bindPopup("<h3>" + feature.properties.place + "</h3><hr><p>" + new Date(feature.properties.time) + "</p><hr><p>Magnitude: " + feature.properties.mag + "</p>");
    }
      

// Function run once for each feature in TectonicData
    // Create tectonic lines
    function onEachTectonic(feature, layer) {
        L.polyline(feature.geometry.coordinates);
      }
  
      // GeoJSON layer containing the features array of the earthquakeData object
      // Run the onEachEarthquake & onEachQuakeLayer functions once for each element in the array
      var earthquakes = L.geoJSON(EarthQuakeData, {
        onEachFeature: onEachEarthquake,
        pointToLayer: onEachQuakeLayer
      });
  
      // Creates a GeoJSON layer containing the features array of the TectonicData object
      // Run the onEachTectonic function once for each element in the array
      var TectonicLines = L.geoJSON(TectonicData, {
        onEachFeature: TectonicLines,
        style: {
          weight: 2,
          color: 'blue'
        }
    });
    // Sends earthquakes, fault lines and timeline layers to the createMap function
    createMap(earthquakes, TectonicLines);

    //Function to create EarthQuakes and Tectonic Lines Map
    function createMap(earthquakes, TectonicLines) {
        //Define Base Layers (satellite, grayscale, outdoors)
        var satellite = L.tileLayer("https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}", {
            attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
            maxZoom: 18,
            id: "mapbox.satellite",
            accessToken: API_KEY
          });
        
          var grayscale = L.tileLayer("https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}", {
            attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
            maxZoom: 18,
            id: "mapbox.light",
            accessToken: API_KEY
          });
      
          var outdoors = L.tileLayer("https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}", {
            attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
            maxZoom: 18,
            id: "mapbox.outdoors",
            accessToken: API_KEY
          });
        
          // Define a baseMaps object to hold our base layers
          var baseMaps = {
            "Satellite": satellite,
            "Grayscale": grayscale,
            "Outdoors": outdoors
          };

          //Define a OverlayMaps object to hold our overlay layers
          var overlayMaps = {
            "Fault Lines": TectonicLines,
            "Earthquake": earthquakes,
          };

          // Create map object for default settings
          var myMap =  L.map('map', {
            center: [37.0902405,-95.7128906],
            zoom: 4,
            layers: [satellite, TectonicLines, earthquakes]
          });

          // Pass our map layers into our layer control
          // Add the layer control to the map
          L.control.layers(baseMaps, overlayMaps, {
             collapsed: false
         }).addTo(myMap);

         
  //Add Legend
  var info = L.control({
    position: "bottomright"
    });

    info.onAdd = function(){
        var div = L.DomUtil.create("div","legend");
        return div;
    }

    info.addTo(myMap);

    document.querySelector(".legend").innerHTML=displayLegend();

    }

    //Function to display legend display color per Earthquake Magnitud
    function displayLegend(){
        var legendInfo = [{
            limit: "Magnitude: 0-1",
            color: "chartreuse"
        },{
            limit: "Magnitude: 1-2",
            color: "greenyellow"
        },{
            limit:"Magnitude: 2-3",
            color:"gold"
        },{
            limit:"Magnitude: 3-4",
            color:"DarkOrange"
        },{
            limit: "Magnitude: 4-5",
            color:"Peru"
        },{
            limit:"Magnitude: 5+",
            color:"red"
        }];
    
        var header = "<h3>Magnitude</h3><hr>";
    
        var strng = "";

       
        for (i = 0; i < legendInfo.length; i++){
            strng += "<p style = \"background-color: "+legendInfo[i].color+"\">"+legendInfo[i].limit+"</p> ";
        }
        
        return header+strng;
    
    }
          

    }

   }
