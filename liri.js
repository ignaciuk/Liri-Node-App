require("dotenv").config();
var moment = require("moment");
var fs = require("fs");
var Spotify = require('node-spotify-api');
var axios = require("axios");
var divider = "\n------------------------------------------------------------\n\n";
var keys = require("./keys.js");
var spotify = new Spotify(keys.spotify);
var omdbApi = require('omdb-client');

var searchType = process.argv[2];
var searchTerm = process.argv.slice(3).join(" ");
var searchTermMovie = process.argv.slice(3).join("_");

var findConcert = function(artist) {
    var URL = "https://rest.bandsintown.com/artists/" + artist + "/events?app_id=codingbootcamp";
    axios.get(URL).then(function(response) {
         var jsonData = response.data;
        if(jsonData.length < 1) {
            console.log('No concerts were found!');
        } else {
            for (var i = 0; i < 5; i++) {
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
        }
    });
};
var findSong = function(song) {
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
var findMovie = function(movie) {
    if (!movie) {
        movie = "Mr. Nobody";
    }
    var params = {
        apiKey: 'trilogy',
        title: movie,
    };
    omdbApi.get(params, function(err, data) {
        if(err) {
            return console.error(err);
        }
        else if(data.length < 1) {
            return console.log('No movies were found!');
        }
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

    if (searchType === "concert-this") {
        findConcert(searchTerm);
    } else if (searchType === "spotify-this") {
        findSong(searchTerm);
    } else if (searchType === "movie-this") {
        findMovie(searchTermMovie);
    } else if (searchType === "do-what-it-says") {
        fs.readFile("random.txt", "utf8", function(error, data) {
            if (error) {
            return console.log(error);
            }
            var dataArr = data.split(",");
            searchType = dataArr[0];
            searchTerm = dataArr[1];

            if (searchType === "spotify-this") {
                findSong(searchTerm);
            } else if (searchType === "concert-this") {
                findConcert(searchTerm);
            } else if (searchType === "movie-this") {
                findMovie(searchTerm);
            }
        });
    }
   