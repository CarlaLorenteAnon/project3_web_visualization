// create the tile layers for the backgrounds of the map
var defaultMap = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
	maxZoom: 19,
	attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
});
// grayscale layer
var grayscale = L.tileLayer('https://stamen-tiles-{s}.a.ssl.fastly.net/toner-lite/{z}/{x}/{y}{r}.{ext}', {
	attribution: 'Map tiles by <a href="http://stamen.com">Stamen Design</a>, <a href="http://creativecommons.org/licenses/by/3.0">CC BY 3.0</a> &mdash; Map data &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
	subdomains: 'abcd',
	minZoom: 0,
	maxZoom: 20,
	ext: 'png'
});
// water color layer
var waterColor = L.tileLayer('https://stamen-tiles-{s}.a.ssl.fastly.net/watercolor/{z}/{x}/{y}.{ext}', {
	attribution: 'Map tiles by <a href="http://stamen.com">Stamen Design</a>, <a href="http://creativecommons.org/licenses/by/3.0">CC BY 3.0</a> &mdash; Map data &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
	subdomains: 'abcd',
	minZoom: 1,
	maxZoom: 16,
	ext: 'jpg'
});
// topography
let topoMap = L.tileLayer('https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png', {
	maxZoom: 17,
	attribution: 'Map data: &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, <a href="http://viewfinderpanoramas.org">SRTM</a> | Map style: &copy; <a href="https://opentopomap.org">OpenTopoMap</a> (<a href="https://creativecommons.org/licenses/by-sa/3.0/">CC-BY-SA</a>)'
});
// make a basemaps object
let basemaps = {
    GrayScale: grayscale,
    "Water Color": waterColor,
    "Topography": topoMap,
    Default: defaultMap
};
// make a map object
var myMap = L.map("map", {
    center: [36.7783, -119.4179],
    zoom: 5,
    layers: [grayscale, waterColor, topoMap, defaultMap]
});
// add the default map to the map
defaultMap.addTo(myMap);

// call the api to get the info for the tectonic plates

//  f = open("GeojsonData/doglatlongfinal.json")
// dogData = json.loads(f.read());
// print(f)
// print(dogData)
// dogFunction = []

// variable to hold the earthquake data layer
let earthquakes = new L.layerGroup();
// get the data for the earthquakes and populate the layergroup
// call the USGS GeoJson API
d3.json("GeojsonData/doglatlongfinal.json")
.then(
    function(earthquakeData){
        // console log to make sure the data loaded
        console.log(earthquakeData);
        // plot circles, where the radius is dependent on the magnitude
        // and the color is dependent on the depth
        // make a function that chooses the color of the data point
        function dataColor(depth){
            if (depth > 90)
                return "red";
            else if(depth > 70)
                return "#FC4903";
            else if(depth > 50)
                return "#FC8403";
            else if(depth > 30)
                return "#FCAD03";
            else if (depth > 10)
                return "#CAFC03";
            else
                return "green";
        }
        // make a function that determines the size of the radius
        function radiusSize(mag){
            if (mag == 0)
                return 1; // makes sure that a 0 mag earthquake shows up
            else
                return mag * 5; // makes sure that the circle is pronounced in the map
        }
        // add on to the style for each data point
        function dataStyle(feature)
        {
            return {
                opacity: 0.5,
                fillOpacity: 0.5,
                fillColor: dataColor(feature.geometry.coordinates[2]), // use index 2 for the depth
                color: "000000", // black outline
                radius: radiusSize(feature.properties.mag), // grabs the magnitude
                weight: 0.5,
                stroke: true
            }
        }
        // add the GeoJson Data to the earthquake layer group
        L.geoJson(earthquakeData, {
            // make each feature a marker that is on the map, each marker is a circle
            pointToLayer: function(feature, latLng) {
                return L.circleMarker(latLng);
            },
            // set the style for each marker
            style: dataStyle, // calls the data style function and passes in the earthquake data
            // add popups
            onEachFeature: function(feature, layer){
                layer.bindPopup(`Magnitude: <b>${feature.properties.mag}</b><br>
                                Depth: <b>${feature.geometry.coordinates[2]}</b><br>
                                Location: <b>${feature.properties.place}</b>`);
            }
        }).addTo(earthquakes);
        earthquakes.addTo(myMap);
    }
);
// add the earthquake layer to the map
// add the overlay for the tectonic plates and for the earthquakes
let overlays = {
    "Earthquake Data": earthquakes
};
// add the Layer control
L.control
    .layers(basemaps, overlays)
    .addTo(myMap);

    
// // add the legend to the map
// let legend = L.control({
//     position: "bottomright"
// });
// // add the properties for the legend
// legend.onAdd = function() {
//     // div for the legend to appear in the page
//     let div = L.DomUtil.create("div", "info legend");
//     console.log(div);
//     // set up the intervals
//     let intervals = [-10, 10, 30, 50, 70, 90];
//     // set the colors for the intervals
//     let colors = [
//         "green",
//         "#CAFC03",
//         "#FCAD03",
//         "#FC8403",
//         "#FC4903",
//         "red"
//     ];
//     // loop through the intervals and the colors and generate a label
//     // with a colored square for each interval
//     for(var i = 0; i < intervals.length; i++)
//     {
//         // inner html that sets the square for each interval and label
//         div.innerHTML += `<i style="background: ${colors[i]}"></i>${intervals[i]}${(intervals[i+1] ? "km &ndash;" + intervals[i+1] + "km<br>" : "km+")}`
//             // + colors[i]
//             // + "'></i>"
//             // + intervals[i]
//             // + (intervals[i + 1] ? "km &ndash;" + intervals[i + 1] + "km<br>" : "+");
//     }
//     return div;
// };
// // add the legend to the map
// legend.addTo(myMap);
