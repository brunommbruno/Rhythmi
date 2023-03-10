import clientId from "./clientId.js";

// Get the hash of the url
const hash = window.location.hash
  .substring(1)
  .split("&")
  .reduce(function(initial, item) {
    if (item) {
      var parts = item.split("=");
      initial[parts[0]] = decodeURIComponent(parts[1]);
    }
    return initial;
  }, {});
window.location.hash = "";

let genre

// Set token
let _token = hash.access_token;

const authEndpoint = "https://accounts.spotify.com/authorize";

const redirectUri = "https://gilded-fairy-691cac.netlify.app/";
// const redirectUri = "http://localhost:5500/";
const scopes = [
  "streaming",
  "user-modify-playback-state"
];

// If there is no token, redirect to Spotify authorization
if (!_token) {
  window.location = `${authEndpoint}?client_id=${clientId}&redirect_uri=${redirectUri}&scope=${scopes.join(
    "%20"
  )}&response_type=token`;
}

// Set up the Web Playback SDK

let deviceId;
let player

let currentElem

window.setGenre = (asd, elem) => {

  currentElem?.classList.remove('active')
  elem.classList.add('active')
  currentElem = elem
  console.log(asd)
  genre = asd
}

window.onSpotifyPlayerAPIReady = () => {
  player = new Spotify.Player({
    name: "Rhythmi",
    getOAuthToken: cb => {
      cb(_token);
    }
  });

  // Ready
  player.on("ready", data => {
    deviceId = data.device_id;
  });
  // Connect to the player!
  player.connect();
};

function makeid(length) {
  var result = "";
  var characters =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  var charactersLength = characters.length;
  for (var i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }
  return result;
}

window.getASong = () => {
  console.log(genre)
  let random_seed = makeid(2);
  let random_offset = Math.floor(Math.random() * 2000); // returns a random integer from 0 to 9
  $.ajax({
    url:
      "https://api.spotify.com/v1/search?type=track&offset=" +
      random_offset +
      "&limit=1&q=" +
      (!genre ? random_seed : 'genre:' + genre),
      // random_seed,
    type: "GET",

    beforeSend: function(xhr) {
      xhr.setRequestHeader("Authorization", "Bearer " + _token);
    },
    success: function(data) {
      $("#embed-uri").attr(
        "src",
        "https://open.spotify.com/embed/track/" + data.tracks.items[0].id
      );
      $("#current-track-name-save").css("display", "block");
    },
    error: function() {
      // run the function again in case of an error response
      getASong();
    }
  });
}
