// Bottom navigation buttons
const buttonOne = document.querySelector('#linkOne')
const buttonTwo = document.querySelector('#linkTwo')
const buttonThree = document.querySelector('#linkThree')
const buttonFour = document.querySelector('#linkFour')
// Fallback image of the albumcards
const lazyBackgrounds = [].slice.call(document.querySelectorAll('.lazy-background'))

// Favorite form/button
const form = document.querySelectorAll('.likeButton')

// Using the intersection observer to implement lazy loading
// Resource: https://web.dev/lazy-loading-images/
document.addEventListener('DOMContentLoaded', () => {
	if ('IntersectionObserver' in window) {
		let lazyBackgroundObserver = new IntersectionObserver((entries, observer) => {
			entries.forEach(entry => {
				if (entry.isIntersecting) {
					entry.target.classList.remove('fallback')
					lazyBackgroundObserver.unobserve(entry.target)
				}
			})
		})

		lazyBackgrounds.forEach(lazyBackground => {
			lazyBackgroundObserver.observe(lazyBackground)
		})
	}
})

// Changes the style of the heart icon on toggle
const toggle = heart => {
	if (heart.classList.contains('fa-heart')) {
		heart.classList.remove('fa-heart')
		heart.classList.add('fa-heart-o')
	} else {
		heart.classList.remove('fa-heart-o')
		heart.classList.add('fa-heart')
	}
}

// Highlights the icon of the page of where the user is located
if (window.location.href === 'http://localhost:4444/favorites') {
	buttonTwo.classList.add('inActive')
	buttonOne.classList.add('inActive')
	buttonThree.classList.add('inActive')
	buttonFour.classList.add('active')
} else if (window.location.href === 'http://localhost:4444/all') {
	buttonTwo.classList.add('inActive')
	buttonThree.classList.add('active')
	buttonOne.classList.add('inActive')
	buttonFour.classList.add('inActive')
} else if (window.location.href === 'http://localhost:4444/add') {
	buttonTwo.classList.add('active')
	buttonOne.classList.add('inActive')
	buttonThree.classList.add('inActive')
	buttonFour.classList.add('inActive')
} else if (
	window.location.href === 'http://localhost:4444/preference' ||
	window.location.href === 'http://localhost:4444/results' ||
	window.location.href === 'http://localhost:4444/home'
) {
	buttonTwo.classList.add('inActive')
	buttonThree.classList.add('inActive')
	buttonOne.classList.add('active')
	buttonFour.classList.add('inActive')
} else {
	buttonTwo.classList.add('inActive')
	buttonOne.classList.add('inActive')
	buttonThree.classList.add('inActive')
	buttonFour.classList.add('inActive')
}
// aysync function handeling the like
const likeHandler = async event => {
	// stop the refresh
	event.preventDefault()
	// here the target event is gonna be made as a value
	const { value } = event.currentTarget
	// there a new object is made with a new value
	const likeValue = { newLike: value }
	// Here the site is gonna route to the version of the site with the like
	const response = await fetch(`/favorites${value}`, {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json',
		},
		body: JSON.stringify(likeValue),
	})
	return response
}

// eventlistener
form.forEach(button => button.addEventListener('click', likeHandler))

// Spotify API function
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
