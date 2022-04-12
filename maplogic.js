////////////////////////////////////
// BEGIN 0 - DEFINE MAP TYPES
////////////////////////////////////
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
    center: [39.50, -98.35],
    zoom: 5,
    layers: [grayscale, waterColor, topoMap, defaultMap]
});
// add the default map to the map
defaultMap.addTo(myMap);
////////////////////////////////////
// END 0 - DEFINE MAP TYPES
////////////////////////////////////
let intervals
    let colors = [
        "green",
        "#CAFC03",
        "#FCAD03",
        "#FC8403",
        "#FC4903",
        "red"
    ];

////////////////////////////////////
// BEGIN 1 - EARTHQUAKE LAYER
////////////////////////////////////
// variable to hold the earthquake data layer
let earthquakes = new L.layerGroup();
// get the data for the earthquakes and populate the layergroup
// call the USGS GeoJson API
d3.json("https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson")
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
////////////////////////////////////
// END 1 - EARTHQUAKE LAYER
////////////////////////////////////


////////////////////////////////////
// BEGIN 2 - PET FRIENDLY LAYER
////////////////////////////////////
let dogPoints = new L.layerGroup();

d3.json("GeojsonData/doglatlongfinal.json")
.then(
    function(dogData){
        // console log to make sure the data loaded
        console.log(dogData);
        
                function dataColor(depth){
                    if (depth > 55)
                        return "red";
                    else if(depth > 52)
                        return "#FC4903";
                    else if(depth > 49)
                        return "#FC8403";
                    else if(depth > 46)
                        return "#FCAD03";
                    else if (depth > 43)
                        return "#CAFC03";
                    else
                        return "green";
                }
                // make a function that determines the size of the radius
                function radiusSize(mag){
                    if (mag == 0)
                        return 1; // makes sure that a 0 mag earthquake shows up
                    else
                        return mag/10; // makes sure that the circle is pronounced in the map
                }
                // add on to the style for each data point
                function dataStyle(feature)
                {
                    return {
                        opacity: 0.5,
                        fillOpacity: 0.5,
                        fillColor: dataColor(feature.properties.total_score), // use index 2 for the depth
                        color: "000000", // black outline
                        radius: radiusSize(feature.properties.total_score), // grabs the magnitude
                        weight: 0.5,
                        stroke: true
                    }
                }
        L.geoJson(dogData, {
            // make each feature a marker that is on the map, each marker is a circle
            pointToLayer: function(feature, latLng) {
                return L.circleMarker(latLng);
            },
            // set the style for each marker
            style: dataStyle, // calls the data style function 
            onEachFeature: function(feature, layer){
                layer.bindPopup(`
                                City: <b>${feature.properties.city}</b><br>
                                Overall Rank: <b>${feature.properties.overall_rank}</b><br>
                                Total Score: <b>${feature.properties.total_score}</b><br>
                                Pet Budget: <b>${feature.properties.pet_budget}</b><br>
                                Pet Health and Wellness: <b>${feature.properties.pet_health}</b><br>
                                Outdoor Pet Friendliness: <b>${feature.properties.outdoor_friendliness}</b>`);
            }
        }).addTo(dogPoints);
        //dogPoints.addTo(myMap);    
    });
////////////////////////////////////
// END 2 - PET FRIENDLY LAYER
////////////////////////////////////


////////////////////////////////////
// BEGIN 3 - HAPPIEST CITIES LAYER
////////////////////////////////////
let happiestPoints = new L.layerGroup();
d3.json("GeojsonData/happiestCityDataFinal.json")
.then(
    function(happiestData){
        // console log to make sure the data loaded
        console.log(happiestData);
        function dataColor(depth){
            if (depth > 90)
                return "red";
            else if(depth > 80)
                return "#FC4903";
            else if(depth > 70)
                return "#FC8403";
            else if(depth > 60)
                return "#FCAD03";
            else if (depth > 50)
                return "#CAFC03";
            else
                return "green";
        }
        // make a function that determines the size of the radius
        function radiusSize(mag){
            if (mag == 0)
                return 1; // makes sure that a 0 mag earthquake shows up
            else
                return mag/5; // makes sure that the circle is pronounced in the map
        }
        // add on to the style for each data point
        function dataStyle(feature)
        {
            properties_update = feature.properties
            return {
                opacity: 0.5,
                fillOpacity: 0.5,
                fillColor: dataColor(properties_update.total_score), // use index 2 for the depth
                color: "000000", // black outline
                radius: radiusSize(properties_update.total_score), // grabs the magnitude
                weight: 0.5,
                stroke: true
            }
        }
        L.geoJson(happiestData, {
            // make each feature a marker that is on the map, each marker is a circle
            pointToLayer: function(feature, latLng) {
                return L.circleMarker(latLng);
            },
            // set the style for each marker
            style: dataStyle, // calls the data style function and passes in the earthquake data
            // add popups
            onEachFeature: function(feature, layer){
                properties_update = feature.properties
                layer.bindPopup(`Location: <b>${properties_update.city}</b><br>
                                Overall Rank: <b>${properties_update.overall_rank}</b><br>
                                Total Score: <b>${properties_update.total_score}</b><br>
                                Emotional and Physical Wellbeing: <b>${properties_update.emotional_physical}</b><br>
                                Community Environment: <b>${properties_update.community_environment}</b><br>
                                Income Employment: <b>${properties_update.income_employment}</b><br>`);
            }
        }).addTo(happiestPoints);
        //happiestPoints.addTo(myMap);
    });
////////////////////////////////////
// END 3 - HAPPIEST CITIES LAYER
////////////////////////////////////


////////////////////////////////////
// BEGIN 4 - WEATHER LAYER
////////////////////////////////////
let weatherpoints = new L.layerGroup();
d3.json("GeojsonData/weatherDataFinal.json")
.then(
    function(weather_data){
        // console log to make sure the data loaded
        console.log(weather_data);
        function dataColor(depth){
            if (depth > 40)
                return "red";
            else if(depth > 30)
                return "#FC4903";
            else if(depth > 20)
                return "#FC8403";
            else if(depth > 10)
                return "#FCAD03";
            else if (depth > 5)
                return "#CAFC03";
            else
                return "green";
        }
        // make a function that determines the size of the radius
        function radiusSize(mag){
            if (mag == 0)
                return 1; // makes sure that a 0 mag earthquake shows up
            else
                return mag/15; // makes sure that the circle is pronounced in the map
        }
        // add on to the style for each data point
        function dataStyle(feature)
        {
            properties_update = feature.properties
            return {
                opacity: 0.5,
                fillOpacity: 0.5,
                fillColor: dataColor(properties_update.temp), // use index 2 for the depth
                color: "000000", // black outline
                radius: radiusSize(properties_update.temp), // grabs the magnitude
                weight: 0.5,
                stroke: true
            }
        }
        L.geoJson(weather_data, {
            // make each feature a marker that is on the map, each marker is a circle
            pointToLayer: function(feature, latLng) {
                return L.circleMarker(latLng);
            },
            // set the style for each marker
            style: dataStyle, // calls the data style function and passes in the earthquake data
            // add popups
            onEachFeature: function(feature, layer){
                properties_update = feature.properties
                layer.bindPopup(`Zip Code: <b>${properties_update.zip_code}</b><br>
                                Temp: <b>${properties_update.temp}</b><br>
                                Pressure: <b>${properties_update.pressure}</b><br>
                                Humidity: <b>${properties_update.humidity}</b><br>
                                Wind speed: <b>${properties_update.wind_speed}</b><br>
                                Clouds: <b>${properties_update.clouds}</b>`);
            }
        }).addTo(weatherpoints);
        //weatherpoints.addTo(myMap);
    });
////////////////////////////////////
// END 4 - WEATHER LAYER
////////////////////////////////////



//////////////////////////////////////////////
// BEGIN 5 - INTERGENERATIONAL MOBILITY LAYER
//////////////////////////////////////////////
//  New Layer Group for Map
    let IntergenerationalMobilityPoints = new L.layerGroup();

// New Function for IntergenerationalMobility
    d3.json("GeojsonData/IntergenerationalMobilityFinal.json")
.then(
    function(IntergenerationalMobility){
        // console log to make sure the data loaded
        console.log(IntergenerationalMobility);
        // add on to the style for each data point
        function dataColor(depth){
            if (depth > 50)
                return "red";
            else if(depth > 47)
                return "#FC4903";
            else if(depth > 44)
                return "#FC8403";
            else if(depth > 41)
                return "#FCAD03";
            else if (depth > 38)
                return "#CAFC03";
            else
                return "green";
        }
        // make a function that determines the size of the radius
        function radiusSize(mag){
            if (mag == 0)
                return 1; // makes sure that a 0 mag earthquake shows up
            else
                return mag/15; // makes sure that the circle is pronounced in the map
        }
        // add on to the style for each data point
        function dataStyle(feature)
        {
            properties_update = feature.properties
            return {
                opacity: 0.5,
                fillOpacity: 0.5,
                fillColor: dataColor(properties_update.absoluteupwardmobility), // use index 2 for the depth
                color: "000000", // black outline
                radius: radiusSize(properties_update.absoluteupwardmobility), // grabs the magnitude
                weight: 0.5,
                stroke: true
            }
        }
        L.geoJson(IntergenerationalMobility, {
            // make each feature a marker that is on the map, each marker is a circle
            pointToLayer: function(feature, latLng) {
                return L.circleMarker(latLng);
            },
            // set the style for each marker
            style: dataStyle, // calls the data style function 
            onEachFeature: function(feature, layer){
                layer.bindPopup(`Zip Code: <b>${feature.properties.zipcode}</b><br>
                                Abs Upward Mobility: <b>${feature.properties.absoluteupwardmobility}</b>`);
            }
        }).addTo(IntergenerationalMobilityPoints);
        //IntergenerationalMobilityPoints.addTo(myMap);
    });
//////////////////////////////////////////////
// END 5 - INTERGENERATIONAL MOBILITY LAYER
//////////////////////////////////////////////


////////////////////////////////////
// BEGIN 6 - INCOME LAYER
////////////////////////////////////
let IncomePoints = new L.layerGroup();

d3.json("GeojsonData/incomeUpdated.json")
.then(
    function(IncomeData){
        // console log to make sure the data loaded
        console.log(IncomeData);
               
                function dataColor(depth){
                    if (depth > 200000)
                        return "red";
                    else if(depth > 150000)
                        return "#FC4903";
                    else if(depth > 100000)
                        return "#FC8403";
                    else if(depth > 80000)
                        return "#FCAD03";
                    else if (depth > 60000)
                        return "#CAFC03";
                    else
                        return "green";
                }
                // make a function that determines the size of the radius
                function radiusSize(mag){
                    if (mag == 0)
                        return 1; // makes sure that a 0 mag earthquake shows up
                    else
                        return mag/40000; // makes sure that the circle is pronounced in the map
                }
                // add on to the style for each data point
                function dataStyle(feature)
                {
                    feature_updated = feature.properties
                    return {
                        opacity: 0.5,
                        fillOpacity: 0.5,
                        fillColor: dataColor(feature.properties.avg_income), // use index 2 for the depth
                        color: "000000", // black outline
                        radius: radiusSize(feature.properties.avg_income), // grabs the magnitude
                        weight: 0.5,
                        stroke: true
                    }
                }
        L.geoJson(IncomeData, {
            // make each feature a marker that is on the map, each marker is a circle
            pointToLayer: function(feature, latLng) {
                return L.circleMarker(latLng);
            },
            // set the style for each marker
            style: dataStyle, // calls the data style function 
            onEachFeature: function(feature, layer){
                feature_updated = feature.properties
                layer.bindPopup(`
                                Average Income: <b>${feature.properties.avg_income}</b><br>
                                Zip Code: <b>${feature.properties.zipcode}</b><br>
                                State: <b>${feature.properties.state}</b><br>
                                Primary City: <b>${feature_updated["Zips.primary_city"]}</b><br>
                                County: <b>${feature_updated["Zips.county"]}</b>`);      // CY - 4/12  last 3 Currently not working  - need to update json
            }
        }).addTo(IncomePoints);
        //IncomePoints.addTo(myMap);    

    });
////////////////////////////////////
// END 6 - INCOME LAYER
////////////////////////////////////


////////////////////////////////////
// BEGIN 7 - NATURAL DISASTER LAYER
////////////////////////////////////
let NaturalDisasterPoints = new L.layerGroup();

d3.json("GeojsonData/naturalDisasters.json")
.then(
    function(NaturalDisasterData){
        // console log to make sure the data loaded
        console.log(NaturalDisasterData);
               
                function dataColor(disaster_number){
                    if (disaster_number > 4000)
                        return "red";
                    else if(disaster_number > 3000)
                        return "#FC4903";
                    else if(disaster_number > 2000)
                        return "#FC8403";
                    else if(disaster_number > 1000)
                        return "#FCAD03";
                    else if (disaster_number > 500)
                        return "#CAFC03";
                    else
                        return "green";
                }
                // make a function that determines the size of the radius
                function radiusSize(disaster_number){

                    if (disaster_number > 4000)
                        return 30;
                    else if(disaster_number > 3000)
                        return 25;
                    else if(disaster_number > 2000)
                        return 20;
                    else if(disaster_number > 1000)
                        return 15;
                    else if (disaster_number > 500)
                        return 12;
                    else
                        return 10;
                }
                // add on to the style for each data point
                function dataStyle(feature)
                {
                    return {
                        opacity: 0.5,
                        fillOpacity: 0.5,
                        fillColor: dataColor(feature.properties.disaster_number), // use index 2 for the depth
                        color: "000000", // black outline
                        radius: radiusSize(feature.properties.disaster_number), // 
                        weight: 0.5,
                        stroke: true
                    }
                }
        L.geoJson(NaturalDisasterData, {
            // make each feature a marker that is on the map, each marker is a circle
            pointToLayer: function(feature, latLng) {
                return L.circleMarker(latLng);
            },
            // set the style for each marker
            style: dataStyle, // calls the data style function 
            onEachFeature: function(feature, layer){
                layer.bindPopup(`
                                State: <b>${feature.properties.state}</b><br>
                                Disaster Count: <b>${feature.properties.disaster_number}</b>`);
            }
        }).addTo(NaturalDisasterPoints);
        //NaturalDisasterPoints.addTo(myMap);    

    });
////////////////////////////////////
// END 7 - NATURAL DISASTER LAYER
////////////////////////////////////


////////////////////////////////////
// BEGIN 8 - NATIONAL PARKS LAYER
////////////////////////////////////
let NationalParksPoints = new L.layerGroup();

d3.json("GeojsonData/nationalParksFinalUpdate.json")
.then(
    function(NationalParksData){
        // console log to make sure the data loaded
        console.log(NationalParksData);
               
                // add on to the style for each data point
                function dataStyle(feature)
                {
                    return {
                        opacity: 0.5,
                        fillOpacity: 0.5,
                        fillColor: "green", // use index 2 for the depth
                        color: "000000", // black outline
                        radius: 5, // 
                        weight: 0.5,
                        stroke: true
                    }
                }
        L.geoJson(NationalParksData, {
            // make each feature a marker that is on the map, each marker is a circle
            pointToLayer: function(feature, latLng) {
                return L.circleMarker(latLng);
            },
            // set the style for each marker
            style: dataStyle, // calls the data style function 
            onEachFeature: function(feature, layer){
                layer.bindPopup(`
                                Park Name: <b>${feature.properties.Name}</b>`);
            }
        }).addTo(NationalParksPoints);
        //NationalParksPoints.addTo(myMap);    

    });
////////////////////////////////////
// END 8 - NATIONAL PARKS LAYER
////////////////////////////////////








////////////////////////////////////
// BEGIN - LAYER OVERLAY DEFINITION
////////////////////////////////////
// add each layer to the map
// add the overlay for the tectonic plates and for the earthquakes
let overlays = {
    "Earthquake Data": earthquakes,
    "Dog Friendliest Cities": dogPoints,
    "Happiest Cities": happiestPoints,
    "InterGen Mobility Cities": IntergenerationalMobilityPoints,
    "Weather Data": weatherpoints,
    "Income Data": IncomePoints,
    "Natural Disaster Data": NaturalDisasterPoints,
    "National Parks Data": NationalParksPoints
};
// add the Layer control
L.control
    .layers(basemaps, overlays)
    .addTo(myMap);
////////////////////////////////////
// END - LAYER OVERLAY DEFINITION.ea
////////////////////////////////////

    


// legend.onAdd = function() {
//     let div = L.DomUtil.create("div", "info legend");
//     console.log(div);
//     for(var i = 0; i < intervals.length; i++)
//     {
//         // inner html that sets the square for each interval and label
//         div.innerHTML += `<i style="background: ${colors[i]}"></i>${intervals[i]}${(intervals[i+1] ? "km &ndash;" + intervals[i+1] + "km<br>" : "km+")}`
//     }
//     return div;
// };
// // add the legend to the map
// legend.addTo(myMap);
var earthquakeLegend = L.control({position: 'bottomright'});
var dogLegend = L.control({position: 'bottomright'});
var happiestCitiesLegend = L.control({position: 'bottomright'});
var interGenLegend = L.control({position: 'bottomright'});
var weatherLegend = L.control({position: 'bottomright'});
var incomeLegend = L.control({position: 'bottomright'});
var naturalDisastersLegend = L.control({position: 'bottomright'});

earthquakeLegend.onAdd = function (myMap) {
    var div = L.DomUtil.create('div', 'info legend');
    let intervals = [0, 10, 30, 50, 70, 90];
    // set the colors for the intervals
    for(var i = 0; i < intervals.length; i++) {
        div.innerHTML += `<i style="background: ${colors[i]}"></i>${intervals[i]}${(intervals[i+1] ? " &ndash;" + intervals[i+1] + "<br>" : "+")}`
    }
    return div;
};

dogLegend.onAdd = function (myMap) {
    var div = L.DomUtil.create('div', 'info legend');
    let intervals = [40,43,46, 49,52,55,60]
    for(var i = 0; i < intervals.length; i++) {
        div.innerHTML += `<i style="background: ${colors[i]}"></i>${intervals[i]}${(intervals[i+1] ? " &ndash;" + intervals[i+1] + "<br>" : "+")}`
    }
    return div;
};

happiestCitiesLegend.onAdd = function (myMap) {
    var div = L.DomUtil.create('div', 'info legend');
    let intervals = [40, 50, 60, 70, 80, 90, 100]
    for(var i = 0; i < intervals.length; i++) {
        div.innerHTML += `<i style="background: ${colors[i]}"></i>${intervals[i]}${(intervals[i+1] ? " &ndash;" + intervals[i+1] + "<br>" : "+")}`
    }
    return div;
};
interGenLegend.onAdd = function (myMap) {
    var div = L.DomUtil.create('div', 'info legend');
    let intervals = [35, 38, 41, 44, 47, 50, 53]
    for(var i = 0; i < intervals.length; i++) {
        div.innerHTML += `<i style="background: ${colors[i]}"></i>${intervals[i]}${(intervals[i+1] ? " &ndash;" + intervals[i+1] + "<br>" : "+")}`
    }
    return div;
};
weatherLegend.onAdd = function (myMap) {
    var div = L.DomUtil.create('div', 'info legend');
    let intervals = [0, 5, 10, 20, 30, 40, 50]
    for(var i = 0; i < intervals.length; i++) {
        div.innerHTML += `<i style="background: ${colors[i]}"></i>${intervals[i]}${(intervals[i+1] ? " &ndash;" + intervals[i+1] + "<br>" : "+")}`
    }
    return div;
};
incomeLegend.onAdd = function (myMap) {
    var div = L.DomUtil.create('div', 'info legend');
    let intervals = [40000, 60000, 80000, 100000, 150000, 200000, 500000]
    for(var i = 0; i < intervals.length; i++) {
        div.innerHTML += `<i style="background: ${colors[i]}"></i>${intervals[i]}${(intervals[i+1] ? " &ndash;" + intervals[i+1] + "<br>" : "+")}`
    }
    return div;
};
naturalDisastersLegend.onAdd = function (myMap) {
    var div = L.DomUtil.create('div', 'info legend');
    let intervals = [0, 500, 1000, 2000, 3000, 4000, 5000]
    for(var i = 0; i < intervals.length; i++) {
        div.innerHTML += `<i style="background: ${colors[i]}"></i>${intervals[i]}${(intervals[i+1] ? " &ndash;" + intervals[i+1] + "<br>" : "+")}`
    }
    return div;
};

//Default one
earthquakeLegend.addTo(myMap);

myMap.on('overlayadd', function (eventLayer) {
    // Switch to the Population legend...
    if (eventLayer.name === 'Earthquake Data') {
        this.removeControl(dogLegend);
        this.removeControl(happiestCitiesLegend);
        this.removeControl(interGenLegend);
        this.removeControl(weatherLegend);
        this.removeControl(incomeLegend);
        this.removeControl(naturalDisastersLegend);
        earthquakeLegend.addTo(this);
    } else if (eventLayer.name === 'Dog Friendliest Cities') {
        this.removeControl(earthquakeLegend);
        this.removeControl(happiestCitiesLegend);
        this.removeControl(interGenLegend);
        this.removeControl(weatherLegend);
        this.removeControl(incomeLegend);
        this.removeControl(naturalDisastersLegend);
        dogLegend.addTo(this);
    } else if (eventLayer.name === 'Happiest Cities') {
        this.removeControl(dogLegend);
        this.removeControl(earthquakeLegend);
        this.removeControl(interGenLegend);
        this.removeControl(weatherLegend);
        this.removeControl(incomeLegend);
        this.removeControl(naturalDisastersLegend);
        happiestCitiesLegend.addTo(this);
    }
    else if (eventLayer.name === 'InterGen Mobility Cities') {
        this.removeControl(dogLegend);
        this.removeControl(happiestCitiesLegend);
        this.removeControl(earthquakeLegend);
        this.removeControl(weatherLegend);
        this.removeControl(incomeLegend);
        this.removeControl(naturalDisastersLegend);
        interGenLegend.addTo(this);
    }else if (eventLayer.name === 'Weather Data') {
        this.removeControl(dogLegend);
        this.removeControl(happiestCitiesLegend);
        this.removeControl(interGenLegend);
        this.removeControl(earthquakeLegend);
        this.removeControl(incomeLegend);
        this.removeControl(naturalDisastersLegend);
        weatherLegend.addTo(this);
    }else if (eventLayer.name === 'Income Data') {
        this.removeControl(dogLegend);
        this.removeControl(happiestCitiesLegend);
        this.removeControl(interGenLegend);
        this.removeControl(weatherLegend);
        this.removeControl(earthquakeLegend);
        this.removeControl(naturalDisastersLegend);
        incomeLegend.addTo(this);
    }else if (eventLayer.name === 'Natural Disaster Data') {
        this.removeControl(dogLegend);
        this.removeControl(happiestCitiesLegend);
        this.removeControl(interGenLegend);
        this.removeControl(weatherLegend);
        this.removeControl(incomeLegend);
        this.removeControl(earthquakeLegend);
        naturalDisastersLegend.addTo(this);
    } else {
        this.removeControl(dogLegend);
        this.removeControl(happiestCitiesLegend);
        this.removeControl(interGenLegend);
        this.removeControl(weatherLegend);
        this.removeControl(incomeLegend);
        this.removeControl(earthquakeLegend);
        this.removeControl(naturalDisastersLegend);
    }
});
