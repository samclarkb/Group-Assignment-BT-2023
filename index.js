// Require external data/functions
const express = require('express')
const multer = require('multer')
const expressLayouts = require('express-ejs-layouts')
const dotenv = require('dotenv').config()
const bodyParser = require('body-parser')
const mongoose = require('mongoose')
const bcrypt = require('bcryptjs')
const session = require('express-session')
const compression = require('compression')
//Album en user model met hashpassword in db
const { Albums, Users } = require('./models/models')
const saltRounds = 10

// Defining express as app
const app = express()

// Compress all HTTP responses
app.use(compression())

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
	res.render('login', {
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
		res.render('results', {
			data: fetchAlbums,
			user: favoriteAlbumTitles,
			userinfo: currentUser,
		})
	})
	.get('/preference', authorizeUser, async (req, res) => {
		const currentUser = await Users.find({ _id: req.session.user.userID })
		res.render('preference', { userinfo: currentUser })
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
			userinfo: currentUser,
		})
	})
	.get('/deleteModal:id', authorizeUser, async (req, res) => {
		const currentUser = await Users.find({ _id: req.session.user.userID })
		const fetchAlbum = await Albums.find({ _id: req.params.id })
		res.render('deleteModal', { data: fetchAlbum, userinfo: currentUser })
	})
	.get('/add', authorizeUser, async (req, res) => {
		const currentUser = await Users.find({ _id: req.session.user.userID })
		res.render('add', { userinfo: currentUser })
	})
	.get('/all', authorizeUser, async (req, res) => {
		const currentUser = await Users.find({ _id: req.session.user.userID })
		const favoriteAlbumTitles = currentUser[0].Like.map(item => item.Title)

		const fetchAlbums = await Albums.find({}).sort({ _id: -1 })
		res.render('all', { data: fetchAlbums, user: favoriteAlbumTitles, userinfo: currentUser })
	})
	.get('/update', authorizeUser, async (req, res) => {
		const fetchOneUser = await Users.find({ _id: req.session.user.userID })
		const currentUser = await Users.find({ _id: fetchOneUser[0]._id })
		res.render('update', { data: currentUser, passError: 'false' })
	})
	.get('/succesUpdate', authorizeUser, (req, res) => {
		res.render('succesUpdate')
	})

	.get('/register', async (req, res) => {
		res.render('register', {
			errorMessage: '',
			errorClass: '',
		})
	})
	.get('/registerSucces', async (req, res) => {
		res.render('registerSucces')
	})
	.get('*', (req, res) => {
		res.status(404).render('404')
	})

const errorlogin = req => {
	return {
		errorMessage: 'Email or password incorrect',
		errorClass: 'errorLogin',
		emailInput: req.body.email,
		passwordInput: req.body.password,
	}
}

// All Post requests
app.post('/home', async (req, res) => {
	// check if email exist in database
	const checkUser = await Users.find({ Email: req.body.email })
	// if user with this email exist check if given password is correct
	if (checkUser.length !== 0) {
		const dbpw = checkUser[0]['Password']
		const cmp = await bcrypt.compare(req.body.password, dbpw)
		// when password is identical with the one in the database, create a session with user ID
		if (cmp) {
			req.session.user = { userID: checkUser[0]['_id'] }
			const currentUser = await Users.find({ _id: req.session.user.userID })
			res.render('preference', { userinfo: currentUser })
		} else {
			// show error message when password is wrong
			res.render('login', errorlogin(req))
		}
	} else {
		// show error message when email is wrong
		res.render('login', errorlogin(req))
	}
})
	.post('/logout', (req, res) => {
		// when user logs out destroy the session
		req.session.destroy()
		// display success message in log in page
		res.render('login', {
			errorMessage: 'You are logged out',
			errorClass: 'successLogout',
			emailInput: '',
			passwordInput: '',
		})
	})
	.post('/results', async (req, res) => {
		const currentUser = await Users.find({ _id: req.session.user.userID })
		const favoriteAlbumTitles = currentUser[0].Like.map(item => item.Title)

		const fetchAlbums = await Albums.find({ Year: req.body.year, Genre: req.body.genre })
		res.render('results', {
			data: fetchAlbums,
			user: favoriteAlbumTitles,
			userinfo: currentUser,
		})
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
	.post('/add', upload.single('File'), async (req, res) => {
		const currentUser = await Users.find({ _id: req.session.user.userID })

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

		res.render('succesAdd', { userinfo: currentUser })
	})
	.post('/delete:id', async (req, res) => {
		const currentUser = await Users.find({ _id: req.session.user.userID })
		const favoriteAlbumTitles = currentUser[0].Like.map(item => item.Title)

		const deleteAlbum = await Albums.find({ _id: req.params.id }).remove()
		const fetchAlbums = await Albums.find({}).sort({ _id: -1 })
		res.render('all', { data: fetchAlbums, user: favoriteAlbumTitles, userinfo: currentUser })
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
		res.render('all', { data: fetchAlbums, user: favoriteAlbumTitles, userinfo: currentUser })
	})

	.post('/update', upload.single('profilePicture'), async (req, res) => {
		try {
			//fetch user
			const fetchOneUser = await Users.find({ _id: req.session.user.userID })
			const currentUser = await Users.find({ _id: fetchOneUser[0]._id })

			var newUsername = { $set: { Username: req.body.newUsername } }
			var newEmail = { $set: { Email: req.body.newEmail } }

			//current password equals current password in database in hash
			const hashCheck = await bcrypt.compare(
				req.body.currentPassword,
				currentUser[0].Password
			)
			//hash new password
			const hashedPwd = await bcrypt.hash(req.body.newPassword, saltRounds)
			var newPassword = { $set: { Password: hashedPwd } }

			//if profile picture is empty keep current profile picture
			if (req.file == undefined) {
				var newProfilePic = {
					$set: {
						Profilepic: {
							data: currentUser[0].Profilepic.data,
							contentType: 'image/png',
						},
					},
				}
				console.log('there is no file uploaded')
			}

			if (req.file != undefined) {
				newProfilePic = {
					$set: { Profilepic: { data: req.file.filename, contentType: 'image/png' } },
				}
				console.log('there is a file uploaded')
			}

			//if username is empty keep current username
			if (req.body.newUsername == '') {
				newUsername = currentUser[0].Username
				console.log('there is no new username')
			}

			//if email is empty keep current email
			if (req.body.newEmail == '') {
				newEmail = currentUser[0].Email
				console.log('there is no new email')
			}

			//if password not empty and current password is not the same as current password in database
			if (
				(req.body.currentPassword !== '' && hashCheck === false) ||
				(req.body.currentPassword == '' && req.body.newPassword !== '')
			) {
				return res.render('update', { data: currentUser, passError: true })
			} else if (hashCheck === true && req.body.newPassword == '') {
				return res.render('update', { data: currentUser, passError: true })
			}

			//update user
			await Users.findOneAndUpdate({ _id: currentUser[0]._id }, newProfilePic)
			await Users.findOneAndUpdate({ _id: currentUser[0]._id }, newUsername)
			await Users.findOneAndUpdate({ _id: currentUser[0]._id }, newEmail)
			await Users.findOneAndUpdate({ _id: currentUser[0]._id }, newPassword)

			res.redirect('/succesUpdate')
		} catch (error) {
			console.log(error)
		}
	})

	.post('/register', upload.single('Profilepic'), async (req, res) => {
		const checkUser = await Users.find({ Email: req.body.email })
		const uname = checkUser['Username']
		Users.findOne({ Email: req.body.email }, async (err, result) => {
			if (err) throw err
			if (result) {
				// doe hier iets om te melden dat het e-mailadres al in gebruik is
				res.render('register', {
					errorMessage: 'Email allready exist',
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
				res.redirect('registerSucces')
			}
		})
	})

// Making sure the application is running on the port I defined in the env file
app.listen(port, () => {
	console.log(`server running on ${port}`)
})
