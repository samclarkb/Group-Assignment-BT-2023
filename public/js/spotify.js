// Spotify Embed test
const frame = document.getElementById("embed-frame");
const spotifyUrl = document.getElementById("spotifyUrl").value;

console.log(spotifyUrl);

      async function changeSong(url) {
        fetch(`https://open.spotify.com/oembed?url=${url}`)
          .then((response) => response.json())
          .then((data) => {
            console.log(data);
            frame.innerHTML = data.html;
          });

      }


changeSong(spotifyUrl);