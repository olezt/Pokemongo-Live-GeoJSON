# Pokemongo-Live-GeoJSON

Just started. Do NOT expect big yet but at least it works... :laughing:

### Description
A bot scans a specific area and retuns a GeoJSON file which is then used to show pokemons on a Google map.

### Requirements
NodeJS installation https://nodejs.org/en/

### To use - No npm module yet

1 Download project and cd into folder</br>
2 npm install pokemon-go-node-api</br>
3 npm install replace</br>
4 npm install openurl</br>
5 Edit config.js file according to your needs</br>
```
//Set environment variables or replace placeholder text
var username = process.env.PGO_USERNAME || 'USER';
var password = process.env.PGO_PASSWORD || 'PASSWD';
var provider = process.env.PGO_PROVIDER || 'ptc';
var direction = "up";
var sw_coords = {
            lat: 37.984998, 
            lon: 23.733532 
        };
var ne_coords = {
            lat: sw_coords.lat+0.01, 
            lon: sw_coords.lon+0.01
        };
```
6 Open cmd and run ```node geoJSONcreator.js```, the map will open</br>
7 Wait until pokemons appear :punch:</br>


### Screenshot

<p align="center">
  <img src="example_screenshot.png" height="450"/>
</p>
