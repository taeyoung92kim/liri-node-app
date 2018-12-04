require("dotenv").config();
var Spotify = require("node-spotify-api");
var request = require("request");
var fs = require("fs");

var keys = require("./keys.js");

var spotify = new Spotify(keys.spotify);
var liri = process.argv[2];
var subject = process.argv[3];

if (process.argv[2] === "do-what-it-says") {
    fs.readFile("random.txt", "utf8", function (error, data) {
        var dataArr = data.split(",");
        liri = dataArr[0];
        subject = dataArr[1];
        spotify.search({ type: 'track', query: subject, limit: 1 }, function (err, data) {
            var songInfo = data.tracks.items[0];
            console.log(songInfo.artists[0].name)
            console.log(songInfo.name)
            console.log(songInfo.preview_url)
            console.log(songInfo.album.name)
        });
    });
}

switch (liri) {
    case "spotify-this-song":
        if (subject) {
            spotify.search({ type: 'track', query: subject, limit: 1 }, function (err, data) {
                var songInfo = data.tracks.items[0];
                console.log(songInfo.artists[0].name)
                console.log(songInfo.name)
                console.log(songInfo.preview_url)
                console.log(songInfo.album.name)
            });
        } else {
            console.log("Invalid input!\n");
            spotify.search({ type: 'track', query: "The Sign (US Album) [Remastered]", limit: 1 }, function (err, data) {
                var songInfo = data.tracks.items[0];
                console.log(songInfo.artists[0].name)
                console.log(songInfo.name)
                console.log(songInfo.preview_url)
                console.log(songInfo.album.name)
            });
        };
        break;

    case "movie-this":
        if (subject) {
            request("http://www.omdbapi.com/?t=" + subject + "&y=&plot=short&apikey=trilogy", function (error, response, body) {
                if (!error && response.statusCode === 200) {
                    console.log(JSON.parse(body).Title);
                    console.log(JSON.parse(body).Year);
                    console.log(JSON.parse(body).imdbRating);
                    console.log(JSON.parse(body).Ratings[1]);
                    console.log(JSON.parse(body).Country);
                    console.log(JSON.parse(body).Language);
                    console.log(JSON.parse(body).Plot);
                    console.log(JSON.parse(body).Actors);
                }
            });
        } else {
            console.log("If you haven't watched 'Mr. Nobody,' then you should: <http://www.imdb.com/title/tt0485947/>.\nIt's on Netflix!")
        }
        break;

    case "concert-this":
        var bandsintown = require("bandsintown")("codingbootcamp");

        if (subject) {
            bandsintown
                .getArtistEventList(subject)
                .then(function (events) {
                    console.log(events);
                    //I was going to console.log the name of the venue, location and date, but for some reason, no matter what I did, nothing would show for events.
                });
        } else {
            console.log("No events in the upcoming future!");
        }
        break;
};