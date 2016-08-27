var fs = require('fs');

//Set environment variables or replace placeholder text
username = process.env.PGO_USERNAME || 'USER';
password = process.env.PGO_PASSWORD || 'PASSWD';
distanceTo=0.01;

if(process.argv[2]!==null){
      name= process.env.PGO_LOCATION || process.argv[2];
}

//Southwest corner of area to scan
sw_coords = {
            lat: 37.984998,  //EXAMPLE
            lon: 23.733532   //EXAMPLE
        };

//Northeast corner of area to scan
ne_coords = {
            lat: sw_coords.lat+distanceTo, 
            lon: sw_coords.lon+distanceTo
};
