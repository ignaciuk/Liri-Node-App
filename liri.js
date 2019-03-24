require("dotenv").config();
var moment = require("moment");
var fs = require("fs");
var Spotify = require('node-spotify-api');
var axios = require("axios");
var divider = "\n------------------------------------------------------------\n\n";
var keys = require("./keys.js");
var spotify = new Spotify(keys.spotify);
var omdbApi = require('omdb-client');

// var doWhatItSays = function() {
var searchType = process.argv[2];
var searchTerm = process.argv.slice(3).join(" ");
var searchTermMovie = process.argv.slice(3).join("_");
var doSearchType = "";
var doSearchTerm = "";
// console.log(searchType);
// console.log(searchTerm);

var liri = function() {
    
    if (searchType === "concert-this") {
        findConcert = function(artist) {
            var URL = "https://rest.bandsintown.com/artists/" + artist + "/events?app_id=codingbootcamp";
            axios.get(URL).then(function(response) {
                var jsonData = response.data;
                for (var i = 0; i < jsonData.length; i++) {
                    // showData ends up being the string containing the show data we will print to the console
                    var showData = [
                        "\n************",
                        "Artist name: " + jsonData[i].lineup[0],
                        "Venue name: " + jsonData[i].venue.name,
                        "Venue location: " + jsonData[i].venue.city + ", " + jsonData[i].venue.country,
                        "Date: " + moment(jsonData[i].datetime).format("L"),
                        "************\n"
                    ].join("\n\n");
                    console.log(showData);
                    // Append showData and the divider to log.txt, print showData to the console
                    fs.appendFile("log.txt", "Command line: " + process.argv.slice(2).join(" ") + "\n"+ showData + divider, function(err) {
                        if (err) throw err;
                    });
                }
            });
        };
        findConcert(searchTerm);

    } else if (searchType === "spotify-this") {
        findSong = function(song) {
            if (!searchTerm) {
                song = "Never Gonna Give You Up";
            }
            spotify.search({type: 'track', query: song, limit: 3}, function(err, data) {
                if (err) {
                  return console.log('Error occurred: ' + err);
                }
                for (var i = 0; i < data.tracks.items.length; i++) {
                var showData = [
                    "\n************",
                    "Artist name: " + data.tracks.items[i].album.artists[0].name,
                    "Track title: " + data.tracks.items[i].name,
                    "Link: " + data.tracks.items[i].external_urls.spotify,
                    "************\n"
                ].join("\n\n");
                console.log(showData);
                // Append showData and the divider to log.txt, print showData to the console
                fs.appendFile("log.txt", "Command line: " + process.argv.slice(2).join(" ") + "\n"+ showData + divider, function(err) {
                    if (err) throw err;
                    });
                }
            });
        };
        findSong(searchTerm);

    } else if (searchType === "movie-this") {
        findMovie = function(movie) {
            var params = {
                apiKey: 'trilogy',
                title: movie,
            };
            omdbApi.get(params, function(err, data) {
                if(err) {
                    return console.error(err);
                }
                if(data.length < 1) {
                    return console.log('No movies were found!');
                }
                console.log(data.Title);

                    var showData = [
                        "\n************",
                        "Movie title: " + data.Title,
                        "Year released: " + data.Year,
                        "IMDB rating: " + data.Ratings[0].Value,
                        "Rotten Tomatoes rating: " + data.Ratings[1].Value,
                        "Country: " + data.Country,
                        "Language: " + data.Language,
                        "Actors: " + data.Actors,
                        "Plot: " + data.Plot,
                        "************\n"
                    ].join("\n\n");
                    console.log(showData);
                    fs.appendFile("log.txt", "Command line: " + process.argv.slice(2).join(" ") + "\n"+ showData + divider, function(err) {
                        if (err) throw err;
                        });
                });
            };
            findMovie(searchTermMovie);

        } else if (searchType === "do-what-it-says") {
            // This block of code will read from the "movies.txt" file.
            // It's important to include the "utf8" parameter or the code will provide stream data (garbage)
            // The code will store the contents of the reading inside the variable "data"
            fs.readFile("random.txt", "utf8", function(error, data) {
                if (error) {
                return console.log(error);
                }
                console.log(data);
                // Then split it by commas (to make it more readable)
                var dataArr = data.split(",");
            
                // We will then re-display the content as an array for later use.
                console.log(dataArr);
                searchType = dataArr[0];
                searchTerm = dataArr[1];
            });
        }
    };
liri();
// };