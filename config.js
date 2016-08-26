//Set environment variables or replace placeholder text
username = process.env.PGO_USERNAME || 'USERNAME';
password = process.env.PGO_PASSWORD || 'PASSWORD';

//Southwest corner of area to scan
sw_coords = {
            lat: 37.984998,  //EXAMPLE
            lon: 23.733532   //EXAMPLE
        };
//Northeast corner of area to scan
ne_coords = {
            lat: sw_coords.lat+0.01, 
            lon: sw_coords.lon+0.01
};

//Create javascript file that is imported in index.html
fs.writeFile("coords.js","var sw_coordlat="+ sw_coords.lat+";\n");
fs.appendFile("coords.js","var sw_coordlon="+ sw_coords.lon+";");
