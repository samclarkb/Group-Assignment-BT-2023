// Spotify Embed test
const frame = document.getElementById('embed-frame')
const spotifyUrl = document.getElementById('spotifyUrl').value

const changeSong = async url => {
	fetch(`https://open.spotify.com/oembed?url=${url}`)
		.then(response => response.json())
		.then(data => {
			frame.innerHTML = data.html
		})
}

changeSong(spotifyUrl)
