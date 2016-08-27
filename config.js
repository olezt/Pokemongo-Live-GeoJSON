var fs = require('fs');

//Set environment variables or replace placeholder text
username = process.env.PGO_USERNAME || 'USER';
password = process.env.PGO_PASSWORD || 'PASSWD';
distanceTo=0.01;

//Southwest corner of area to scan
sw_coords = {
            lat: 37.984998,  //EXAMPLE
            lon: 23.733532   //EXAMPLE
        };
        
if(process.argv[2]!==null){
      var location="";
      for(var i=2;i<process.argv.length;i++){
            location=location+" "+process.argv[i];
      }
            name= process.env.PGO_LOCATION || location;
}

//Northeast corner of area to scan
ne_coords = {
            lat: sw_coords.lat+distanceTo, 
            lon: sw_coords.lon+distanceTo
};
