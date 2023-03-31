// Require external data/functions
const express = require('express')
const multer = require('multer')
const expressLayouts = require('express-ejs-layouts')
const dotenv = require('dotenv').config()
const bodyParser = require('body-parser')
const mongoose = require('mongoose')
const bcrypt = require('bcrypt')
const session = require('express-session')
//Album en user model met hashpassword in db
const { Albums, Users } = require('./models/models')
const saltRounds = 10
let userInfo

// Defining express as app
const app = express()

// creating a session
app.use(
	session({
		secret: process.env.SESSION_KEY,
		resave: true,
		saveUninitialized: true,
		cookie: { maxAge: 600000 },
	})
)

// check if user is authorized (logged in) to visit a page
const authorizeUser = (req, res, next) => {
	if (!req.session.user) {
		res.status(401).render('401')
	} else {
		next()
	}
}

// env variables
const userName = process.env.USERNAME
const passWord = process.env.PASSWORD
const port = process.env.PORT

// Mongodb url
const url = `mongodb+srv://${userName}:${passWord}@Database.ymup0ov.mongodb.net/?retryWrites=true&w=majority`

// Making connection with Mongodb
mongoose.set('strictQuery', false)
mongoose
	.connect(url, { useNewUrlParser: true, useUnifiedTopology: true })
	.then(() => {
		console.log('connected to MongoDB')
	})
	.catch(e => {
		console.log('error', e)
	})

// Defing the storage object for Multer
const storage = multer.diskStorage({
	// Giving a destination to the uploaded images
	destination: (req, file, cb) => {
		cb(null, 'public/images')
	},
	// Giving a file name to the uploaded images
	// Added the current date to make sure their will be no duplicate images name
	filename: (req, file, cb) => {
		console.log('file', file)
		cb(null, Date.now() + '-' + file.originalname)
	},
})

const upload = multer({ storage: storage })

// Set the view engine to ejs
app.set('view engine', 'ejs')

// app .use
app.use(express.static(__dirname + '/public'))
	.use(expressLayouts)
	.use(
		bodyParser.urlencoded({
			extended: true,
		})
	)

// All Get requests
app.get('/', (req, res) => {
	res.render('inloggen', {
		errorMessage: '',
		errorClass: '',
		emailInput: '',
		passwordInput: '',
	})
})
	.get('/results', authorizeUser, async (req, res) => {
		const currentUser = await Users.find({ _id: req.session.user.userID })
		const favoriteAlbumTitles = currentUser[0].Like.map(item => item.Title)
		const fetchAlbums = await Albums.find({})
		res.render('results', { data: fetchAlbums, user: favoriteAlbumTitles, userinfo: userInfo })
	})
	.get('/preference', authorizeUser, async (req, res) => {
		res.render('preference', { userinfo: userInfo })
	})
	.get('/results:id', authorizeUser, async (req, res) => {
		const fetchOneAlbum = await Albums.find({ _id: req.params.id })
		res.render('detailPageResults', { data: fetchOneAlbum })
	})
	.get('/favorites:id', authorizeUser, async (req, res) => {
		const fetchOneAlbum = await Albums.find({ _id: req.params.id })
		res.render('detailPageFavorites', { data: fetchOneAlbum })
	})
	.get('/all:id', authorizeUser, async (req, res) => {
		const fetchOneAlbum = await Albums.find({ _id: req.params.id })
		res.render('detailPageAll', { data: fetchOneAlbum })
	})
	.get('/favorites', authorizeUser, async (req, res) => {
		const currentUser = await Users.find({ _id: req.session.user.userID })
		const favoriteAlbums = currentUser[0].Like
		const favoriteAlbumTitles = currentUser[0].Like.map(item => item.Title)
		res.render('favorites', {
			data: favoriteAlbums,
			user: favoriteAlbumTitles,
			userinfo: userInfo,
		})
	})
	.get('/deleteModal:id', authorizeUser, async (req, res) => {
		console.log('req', req.params.id)
		const fetchAlbum = await Albums.find({ _id: req.params.id })
		res.render('deleteModal', { data: fetchAlbum })
	})
	.get('/add', authorizeUser, (req, res) => {
		res.render('add', { userinfo: userInfo })
	})
	.get('/all', authorizeUser, async (req, res) => {
		const currentUser = await Users.find({ _id: req.session.user.userID })
		const favoriteAlbumTitles = currentUser[0].Like.map(item => item.Title)

		const fetchAlbums = await Albums.find({}).sort({ _id: -1 })
		res.render('all', { data: fetchAlbums, user: favoriteAlbumTitles, userinfo: userInfo })
	})
	.get('/update', async (req, res) => {
		const currentUser = await Users.find({ _id: req.session.user.userID })
		const fetchOneUser = await Users.find({ _id: currentUser[0]._id })
		res.render('update', { data: fetchOneUser, passError: 'false' })
	})
	.get('/register', async (req, res) => {
		res.render('register', {
			errorMessage: '',
			errorClass: '',
		})
	})
	.get('/register-failed', async (req, res) => {
		res.render('register-failed')
	})
	.get('/register-succes', async (req, res) => {
		res.render('register-succes')
	})
	.get('*', (req, res) => {
		res.status(404).render('404')
	})

// All Post requests
app.post('/home', async (req, res) => {
	const checkUser = await Users.find({ Email: req.body.email })
	if (checkUser.length !== 0) {
		const dbpw = checkUser[0]['Password']
		const cmp = await bcrypt.compare(req.body.password, dbpw)
		if (cmp) {
			req.session.user = { userID: checkUser[0]['_id'] }
			userInfo = await Users.find({ _id: req.session.user.userID })
			res.render('preference', { userinfo: userInfo })
		}
	} else {
		res.render('inloggen', {
			errorMessage: 'Combinatie email en wachtwoord onjuist',
			errorClass: 'errorLogin',
			emailInput: req.body.email,
			passwordInput: req.body.password
		})
	}
})
	.post('/logout', (req, res) => {
		req.session.destroy()
		res.render('inloggen', {
			errorMessage: 'u bent succesvol uitgelogd!',
			errorClass: 'successLogout',
			emailInput: '',
			passwordInput: '',
		})
	})
	.post('/results', async (req, res) => {
		const currentUser = await Users.find({ _id: req.session.user.userID })
		const favoriteAlbumTitles = currentUser[0].Like.map(item => item.Title)

		const fetchAlbums = await Albums.find({ Year: req.body.year, Genre: req.body.genre })
		res.render('results', { data: fetchAlbums, user: favoriteAlbumTitles, userinfo: userInfo })
	})
	.post('/favorites:id', async (req, res) => {
		const currentUser = await Users.findOne({ _id: req.session.user.userID })
		const currentAlbum = await Albums.findOne({ _id: req.params.id })

		const albumTitle = currentUser.Like.map(item => item.Title)

		if (albumTitle.includes(currentAlbum.Title)) {
			const updateFavorite = await Users.findOneAndUpdate(
				{ _id: currentUser.id },
				{ $pull: { Like: currentAlbum } }
			)
		} else {
			const updateFavorite = await Users.findOneAndUpdate(
				{ _id: currentUser.id },
				{ $push: { Like: currentAlbum } }
			)
		}
	})
	.post('/add', upload.single('File'), (req, res) => {
		console.log('req', req.body)

		Albums.insertMany([
			{
				Title: req.body.Title,
				Artist: req.body.Artist,
				Genre: req.body.Genre,
				Year: req.body.Year,
				Like: false,
				Description: req.body.Description,
				Image: { data: req.file.filename, contentType: 'image/png' },
				SpotifyLink: req.body.SpotifyLink,
			},
		]).then(() => console.log('user saved'))

		res.render('succesAdd')
	})
	.post('/delete:id', async (req, res) => {
		const currentUser = await Users.find({ _id: req.session.user.userID })
		const favoriteAlbumTitles = currentUser[0].Like.map(item => item.Title)

		const deleteAlbum = await Albums.find({ _id: req.params.id }).remove()
		const fetchAlbums = await Albums.find({}).sort({ _id: -1 })
		res.render('all', { data: fetchAlbums, user: favoriteAlbumTitles })
	})
	.post('/all', async (req, res) => {
		const currentUser = await Users.find({ _id: req.session.user.userID })
		const favoriteAlbumTitles = currentUser[0].Like.map(item => item.Title)

		const fetchAlbums = await Albums.find({
			$or: [
				{ Title: req.body.search },
				{ Artist: req.body.search },
				{ Year: req.body.search },
				{ Genre: req.body.search },
			],
		})
		res.render('all', { data: fetchAlbums, user: favoriteAlbumTitles, userinfo: userInfo })
	})
	.post('/update', upload.single('profilePicture'), async (req, res) => {
		let currentUser = await Users.find({ _id: req.session.user.userID })
		try {
			//fetch user
			const fetchOneUser = await Users.find({ _id: currentUser._id })
			currentUser = { _id: currentUser._id }

			//if profile picture is empty keep current profile picture
			if (req.file == undefined) {
				req.file = { filename: fetchOneUser[0].Profilepic.data }
			} else {
				//profile picture
				const newProfilePic = {
					$set: { Profilepic: { data: req.file.filename, contentType: 'image/png' } },
				}
				changeProfilePic = await Users.findOneAndUpdate(currentUser, newProfilePic)
			}

			//if username is empty keep current username
			if (req.body.newUsername == '') {
				req.body.newUsername = fetchOneUser[0].Username
			} else {
				//change username
				const newUsername = { $set: { Username: req.body.newUsername } }
				changeUsername = await Users.findOneAndUpdate(currentUser, newUsername)
			}

			//if email is empty keep current email
			if (req.body.newEmail == '') {
				req.body.newEmail = fetchOneUser[0].Email
			} else {
				// change email
				const newEmail = { $set: { Email: req.body.newEmail } }
				changeEmail = await Users.findOneAndUpdate(currentUser, newEmail)
			}

			//if password is empty keep current password
			if (req.body.newPassword == '') {
				req.body.newPassword = fetchOneUser[0].Password
			}
			if (req.body.currentPassword != fetchOneUser[0].Password) {
				//if current password is not the same as the password of user give error
				console.log('error')
				res.render('update', { data: fetchOneUser, passError: 'true' })
			} else {
				// change password
				const newPassword = { $set: { Password: req.body.newPassword } }
				changePassword = await Users.findOneAndUpdate(currentUser, newPassword)
			}

			res.render('succesUpdate', { data: fetchOneUser, passError: 'false' })

			console.log(req.file.filename, req.body)
		} catch (err) {
			console.log(err)
		}
	})

	.post('/register', upload.single('Profilepic'), async (req, res) => {
		const checkUser = await Users.find({ Email: req.body.email })
		const uname = checkUser['Username']
		Users.findOne({ Email: req.body.email }, async function (err, result) {
			if (err) throw err
			if (result) {
				// doe hier iets om te melden dat het e-mailadres al in gebruik is
				console.log('email komt al voor')
				res.render('register', {
					errorMessage: 'Email al in gebruik',
					errorClass: 'errorLogin',
				})
			} else {
				// als de email niet in gebruik is, voor onderstaande commando uit
				const hashedPwd = await bcrypt.hash(req.body.password, saltRounds)
				Users.insertMany([
					{
						Username: req.body.username,
						Password: hashedPwd,
						Email: req.body.email,
						Profilepic: { data: req.file.filename, contentType: 'image/png' },
					},
				]).then(() => console.log('user saved'))
				res.redirect('register-succes')
			}
		})
	})

// Making sure the application is running on the port I defined in the env file
app.listen(port, () => {
	console.log(`server running on ${port}`)
})
