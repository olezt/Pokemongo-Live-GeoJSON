var fs = require('fs');
//Set environment variables or replace placeholder text
username = process.env.PGO_USERNAME || 'USER';
password = process.env.PGO_PASSWORD || 'PASSWD';

//Southwest corner of area to scan
sw_coords = {
            lat: 37.984998,  //EXAMPLE
            lon: 23.733532   //EXAMPLE
        };

distanceTo=0.02;
//Northeast corner of area to scan
ne_coords = {
            lat: sw_coords.lat+distanceTo, 
            lon: sw_coords.lon+distanceTo
};

//Create javascript file that is imported in index.html
fs.writeFile("coords.js","var sw_coordlat="+ sw_coords.lat+";\n");
fs.appendFile("coords.js","var sw_coordlon="+ sw_coords.lon+";\n");
fs.appendFile("coords.js","var distanceTo="+ distanceTo+";");
