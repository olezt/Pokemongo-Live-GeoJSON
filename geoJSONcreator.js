'use strict';

var openmap=require("openurl");
require('./config.js');
var PokemonGO = require('pokemon-go-node-api');
var replace = require("replace");
var fs = require('fs');

// using var so you can login with multiple users
var a = new PokemonGO.Pokeio();
var location = initLatLng();

var pokemons=[];
var firstpokemon = true;
var walkbeat = 0.0005;
var provider = process.env.PGO_PROVIDER || 'ptc';
var direction = "up";

/**
 * Initialise user and start search interval
 */
a.init(username, password, location, provider, function (err) {
    if (err)
        throw err;
    fs.writeFile("pokemons_rawdata.json", '{ "type": "FeatureCollection","features": [');
    console.log('[i] Current location: ' + a.playerInfo.locationName);
    console.log('[i] lat/long/alt: : ' + a.playerInfo.latitude + ' ' + a.playerInfo.longitude + ' ' + a.playerInfo.altitude);
    //in case user set name by cli
    sw_coords.lat=a.playerInfo.latitude ;
    sw_coords.lon=a.playerInfo.longitude;
    //Create javascript file that is imported in index.html
    fs.writeFile("coords.js","var sw_coordlat="+ sw_coords.lat+";\n");
    fs.appendFile("coords.js","var sw_coordlon="+ sw_coords.lon+";\n");
    fs.appendFile("coords.js","var distanceTo="+ distanceTo+";");
    openmap.open("index.html");

    a.GetProfile(function (err, profile) {
        
        if (err)
            throw err;

        console.log('[i] Username: ' + profile.username);
        setInterval(function(){


            a.Heartbeat(function (err, hb) {
                if (err) {
                    console.log(err);
                }
                nextMove();
		if(hb!=null) {
			searchForPokemons(hb);
		}

            });

        }, 4000);

    });
});

/**
 * Initialise lat lng to start
 */
function initLatLng(){
	var location = {};
	if(name==null){
	    location = {
		type: 'coords',
		coords: {
		    latitude: sw_coords.lat, 
		    longitude: sw_coords.lon,
		    altitude: 0
		}
	    };
	}else{
	    location = {
		type: 'name',
		name: process.env.PGO_LOCATION || name //use name or coords
	    }; 
	}
	return location;
}

/**
 * Search for pokemons
 */
function searchForPokemons(hb) {
    var i,
    current_pokemon_proto,
    current_pokemon_data={},
    seen=false;

                for (i = hb.cells.length - 1; i >= 0; i--) {
                    
                    if (hb.cells[i].WildPokemon[0]) {
                        seen=false;
                        
                        for (var j = 0; j < pokemons.length; j++) {
                            if (hb.cells[i].WildPokemon[0].EncounterId === pokemons[j].encounter_id) {
                                seen=true;
                                continue;
                            }
                        }
                        
                        if (seen === false) {
                            current_pokemon_proto = PokemonGO.pokemonlist[parseInt(hb.cells[i].WildPokemon[0].pokemon.PokemonId) - 1];
                            var will_dissapear = new Date(Date.now() + hb.cells[i].WildPokemon[0].TimeTillHiddenMs);
                            current_pokemon_data={disappear_time:will_dissapear.getTime(),encounter_id:hb.cells[i].WildPokemon[0].EncounterId,
                                latitude:hb.cells[i].WildPokemon[0].Latitude,longitude:hb.cells[i].WildPokemon[0].Longitude,
                                pokemon_name:current_pokemon_proto.name,pokemon_img:current_pokemon_proto.img,spawnpoint_id:hb.cells[i].WildPokemon[0].SpawnPointId};
                            pokemons.push(current_pokemon_data);
                            firstpokemon=printJSON(firstpokemon,current_pokemon_data);
                        }
                    }
                }
}

/**
 * Append to file the json object
 */
function printJSON(firstpokemon,pokemon) {

        console.log('Wild '+ pokemon.pokemon_name + ' appeared');
        var jsonPokemon='{ "type": "Feature","geometry": {"type": "Point", "coordinates": ['+pokemon.longitude+','+pokemon.latitude+']},"properties": '+JSON.stringify(pokemon)+'}]}';
        
        if (firstpokemon !== true) {
            replace({
                regex: "(]})$",
                replacement: ","+jsonPokemon,
                paths: ['./pokemons_rawdata.json'],
                recursive: false,
                silent: true
            });
        }else{
            fs.appendFile("pokemons_rawdata.json", jsonPokemon);
        }
        return false;
    }; 

function printBotJSON() {
        var jsonBot='{ "type": "FeatureCollection","features": [{ "type": "Feature","geometry": {"type": "Point", "coordinates": ['+a.playerInfo.longitude+','+a.playerInfo.latitude+']},"properties": {"name": "Searching Pokemooorons"}}]}';
        fs.writeFile("bot_rawdata.json", jsonBot);
    };

/**
 * Make the next move on searching
 */
function nextMove() {
	printBotJSON();
    	switch (direction) {
                    case "up":
                        a.playerInfo.latitude += walkbeat;
                        a.playerInfo.latitude = (a.playerInfo.latitude).toFixed(6);
                        a.playerInfo.latitude = parseFloat(a.playerInfo.latitude);
                        if (a.playerInfo.latitude >= ne_coords.lat) {
                            direction = "down";
                            if (a.playerInfo.longitude <= ne_coords.lon) {
                                a.playerInfo.longitude += walkbeat;
                                a.playerInfo.longitude = (a.playerInfo.longitude).toFixed(6);
                                a.playerInfo.longitude = parseFloat(a.playerInfo.longitude);
                            } else {
                                a.playerInfo.longitude -= walkbeat;
                                a.playerInfo.longitude = (a.playerInfo.longitude).toFixed(6);
                                a.playerInfo.longitude = parseFloat(a.playerInfo.longitude);
                            }
                        }
                        break;
                    case "down":
                        a.playerInfo.latitude -= walkbeat;
                        a.playerInfo.latitude = (a.playerInfo.latitude).toFixed(6);
                        a.playerInfo.latitude = parseFloat(a.playerInfo.latitude);
                        if (a.playerInfo.latitude <= sw_coords.lat) {
                            direction = "up";
                            if (a.playerInfo.longitude <= ne_coords.lon) {
                                a.playerInfo.longitude += walkbeat;
                                a.playerInfo.longitude = (a.playerInfo.longitude).toFixed(6);
                                a.playerInfo.longitude = parseFloat(a.playerInfo.longitude);
                            } else {
                                a.playerInfo.longitude -= walkbeat;
                                a.playerInfo.longitude = (a.playerInfo.longitude).toFixed(6);
                                a.playerInfo.longitude = parseFloat(a.playerInfo.longitude);
                            }
                        }
                        break;
                }

}
