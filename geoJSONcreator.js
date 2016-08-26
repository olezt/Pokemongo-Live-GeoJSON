'use strict';

var openmap=require("openurl");
require('./config.js');
var PokemonGO = require('pokemon-go-node-api');
var replace = require("replace");
var fs = require('fs');
// using var so you can login with multiple users
var a = new PokemonGO.Pokeio();
var pokemons=[];
openmap.open("index.html");
var location = {
    type: 'coords',
    //name: process.env.PGO_LOCATION || 'Acropolis athens greece' //use name or coords
    coords: {
        latitude: sw_coords.lat, 
        longitude: sw_coords.lon,
        altitude: 0
    }
};
var firstpokemon = true;
var walkbeat = 0.0005;
var provider = process.env.PGO_PROVIDER || 'ptc';
var direction = "up";


a.init(username, password, location, provider, function (err) {
    if (err)
        throw err;
        fs.writeFile("pokemons_rawdata.json", '{ "type": "FeatureCollection","features": [');
    console.log('[i] Current location: ' + a.playerInfo.locationName);
    console.log('[i] lat/long/alt: : ' + a.playerInfo.latitude + ' ' + a.playerInfo.longitude + ' ' + a.playerInfo.altitude);



    a.GetProfile(function (err, profile) {
        
        if (err)
            throw err;

        console.log('[i] Username: ' + profile.username);
        setInterval(function(){


            a.Heartbeat(function (err, hb) {
                if (err) {
                    console.log(err);
                }
                next_move();
		if(hb!=null) {
			search_for_pokemons(hb);
		}

            });

fs.writeFile("botcoords.js","var botlat="+ a.playerInfo.latitude+";\n var botlon="+ a.playerInfo.longitude+";");
        }, 4000);

    });
});

function search_for_pokemons(hb) {
    
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

function next_move() {

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
