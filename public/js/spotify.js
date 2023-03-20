// Spotify Embed test
const frame = document.getElementById("embed-frame");
const titleSong = document.getElementById("titleSong");
const titleImg = document.getElementById("titleImg");

      async function changeSong(url) {
        fetch(`https://open.spotify.com/oembed?url=${url}`)
          .then((response) => response.json())
          .then((data) => {
            console.log(data);
            frame.innerHTML = data.html;
            titleSong.innerHTML = data.title;
            titleImg.src = data.thumbnail_url

          });

      }


changeSong('https://open.spotify.com/playlist/37i9dQZF1DX4sWSpwq3LiO');