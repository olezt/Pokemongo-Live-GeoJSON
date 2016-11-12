# Pokemongo-Live-GeoJSON

### Description
Server-side (NodeJS): A bot scans a specific area and retuns a GeoJSON file full of pokemon<br>
Client-side: An HTML page previews the found pokemons on a Google map.

### Requirements
NodeJS installation https://nodejs.org/en/

### How to use

1. Download project and cd into folder</br>
2. npm install pokemon-go-node-api replace openurl</br>
3. Edit config.js file according to your needs</br>
4. Open cmd</br>
4.1 Execute: ```node geoJSONcreator.js```, the map will open</br>
4.2 Or set location as: ```node geoJSONcreator.js Times square new york```</br>
5. Wait until pokemons appear :punch:</br>
```
//Set environment variables or replace placeholder text
username = process.env.PGO_USERNAME || 'USER';
password = process.env.PGO_PASSWORD || 'PASSWD';
distanceTo=0.01;
//Southwest corner of area to scan
sw_coords = {
            lat: 37.984998,  //EXAMPLE
            lon: 23.733532   //EXAMPLE
        };
```

### Screenshot

<p align="center">
  <img src="example_screenshot.png" height="450"/>
</p>
Based on https://github.com/Armax/Pokemon-GO-node-api
