// Bottom navigation buttons
const buttonOne = document.querySelector('#linkOne')
const buttonTwo = document.querySelector('#linkTwo')
const buttonThree = document.querySelector('#linkThree')
const buttonFour = document.querySelector('#linkFour')
// Fallback image of the albumcards
const lazyBackgrounds = [].slice.call(document.querySelectorAll('.lazy-background'))

// Favorite form/button
const form = document.querySelectorAll('.likeForm')

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
	window.location.href === 'http://localhost:4444/' ||
	window.location.href === 'http://localhost:4444/results'
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

const likeHandler = async (event) => { // stop refresh 
	event.preventDefault() 
	// value van de submit button dat de song id is wss
	 const { value } = event.currentTarget 
	 console.log('Banaan')
	 // stop dit in een object
	 const likeValue = { newLike: value } 
	 // vul hier je like route in, dus niet /like-game maar de action route van je form
	const response = await fetch(`/favorites${value}`,
	 { method: 'POST', headers: {
		 'Content-Type': 'application/json' 
		},
		body: JSON.stringify(likeValue) }) 
		return response
	}
console.log(form);


form.forEach(button => button.addEventListener('click', likeHandler))

//async function postData(url = "", data = {}) {
	//const response = await fetch(url, {
	  //method: "POST", 
	  //mode: "cors", 
	  //cache: "no-cache", 
	  //credentials: "same-origin", 
	  //headers: {
		//"Content-Type": "application/json",
		
	  //},
	  //redirect: "follow", 
	  //referrerPolicy: "no-referrer", 
	//});
	//return response.json(); 
  //}
  
  //postData("http://localhost:3333/favorites:id", { answer: 42 }).then((data) => {
	//console.log(data); 
  //});

  //forum.addEventListener("click",postData)
  

// fetch favorite
// form.forEach(item => {
// 	item.addEventListener('submit', event => {
// 		event.preventDefault()
// 		const formData = new FormData(event.target)
// 		fetch('http://localhost:3333/favorites:id', {
// 			method: 'POST',
// 			body: formData,
// 		}).then(res => res.json())
// 	})
// })
