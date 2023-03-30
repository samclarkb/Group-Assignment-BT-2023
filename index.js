// Require external data/functions
const express = require('express')
const multer = require('multer')
const expressLayouts = require('express-ejs-layouts')
const dotenv = require('dotenv').config()
const bodyParser = require('body-parser')
const mongoose = require('mongoose')
const {Albums, Users} = require('./models/models')

// Defining express as app
const app = express()

// env variables
const userName = process.env.USERNAME
const passWord = process.env.PASSWORD
const port = process.env.PORT

// Mongodb url
const url = `mongodb+srv://${userName}:${passWord}@Database.ymup0ov.mongodb.net/?retryWrites=true&w=majority`

// Making connection with Mongodb
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
	res.render('preference')
})
	.get('/results', async (req, res) => {
		const fetchAlbums = await Albums.find({})
		res.render('results', { data: fetchAlbums })
	})
	.get('/results:id', async (req, res) => {
		const fetchOneAlbum = await Albums.find({ _id: req.params.id })
		res.render('detailPageResults', { data: fetchOneAlbum })
	})
	.get('/favorites:id', async (req, res) => {
		const fetchOneAlbum = await Albums.find({ _id: req.params.id })
		res.render('detailPageFavorites', { data: fetchOneAlbum })
	})
	.get('/all:id', async (req, res) => {
		const fetchOneAlbum = await Albums.find({ _id: req.params.id })
		res.render('detailPageAll', { data: fetchOneAlbum })
	})
	.get('/favorites', async (req, res) => {
		const fetchFavorite = await Albums.find({ Like: true })
		res.render('favorites', { data: fetchFavorite })
	})
	.get('/deleteModal:id', async (req, res) => {
		console.log('req', req.params.id)
		const fetchAlbum = await Albums.find({ _id: req.params.id })
		res.render('deleteModal', { data: fetchAlbum })
	})
	.get('/add', (req, res) => {
		res.render('add')
	})
	.get('/all', async (req, res) => {
		const fetchAlbums = await Albums.find({}).sort({ _id: -1 })
		res.render('all', { data: fetchAlbums })
	})
	.get('/update', async (req, res) => {
		const fetchOneUser = await Users.find({ _id: '641c6d36e398c3ee8d693809' })
		res.render('update', { data: fetchOneUser })
		})
	.get('*', (req, res) => {
		res.status(404).render('404')
	})

// All Post requests
app.post('/results', async (req, res) => {
	const fetchAlbums = await Albums.find({ Year: req.body.year, Genre: req.body.genre })
	res.render('results', { data: fetchAlbums })
})
	.post('/favorites:id', async (req, res) => {
		const updateFavorite = await Albums.findOneAndUpdate({ _id: req.params.id }, [
			{ $set: { Like: { $eq: [false, '$Like'] } } },
		])
		// res.redirect(`/${req.originalUrl}}`, { data: updateFavorite })
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
			},
		]).then(() => console.log('user saved'))

		res.render('succesAdd')
	})
	.post('/delete:id', async (req, res) => {
		const deleteAlbum = await Albums.find({ _id: req.params.id }).remove()
		const fetchAlbums = await Albums.find({}).sort({ _id: -1 })
		res.render('all', { data: fetchAlbums })
	})
	.post('/all', async (req, res) => {
		const fetchAlbums = await Albums.find({
			$or: [
				{ Title: req.body.search },
				{ Artist: req.body.search },
				{ Year: req.body.search },
				{ Genre: req.body.search },
			],
		})
		res.render('all', { data: fetchAlbums })
	})

	.post('/update', upload.single('profilePicture'), async(req, res) => {

		try{
			//fetch user
			const fetchOneUser = await Users.find({ _id: '641c6d36e398c3ee8d693809'})
			currentUser = {_id:'641c6d36e398c3ee8d693809'}

			//if profile picture is empty keep current profile picture
			if (req.file == undefined) {
				req.file = { filename: fetchOneUser[0].Profilepic.data }
			} else {
			//profile picture
			const newProfilePic = { $set: { Profilepic: { data: req.file.filename, contentType: 'image/png' }}}
			changeProfilePic = await Users.findOneAndUpdate(currentUser , newProfilePic)
			}

			//if username is empty keep current username
			if (req.body.newUsername == '') {
				req.body.newUsername = fetchOneUser[0].Username
			} else{
			//change username
			const newUsername = { $set: { Username: req.body.newUsername } }
			changeUsername = await Users.findOneAndUpdate(currentUser, newUsername)
			}

			//if email is empty keep current email
			if (req.body.newEmail == '') {
				req.body.newEmail = fetchOneUser[0].Email
			} else{
			// change email
			const newEmail = { $set: { Email: req.body.newEmail } }
			changeEmail = await Users.findOneAndUpdate(currentUser,newEmail)
			}

			//if password is empty keep current password
			if (req.body.newPassword == '') {
				req.body.newPassword = fetchOneUser[0].Password
			} 
			if (req.body.currentPassword != fetchOneUser[0].Password) {
				//if current password is not the same as the password of user give error
				console.log('error')
			} else {
			// change password
			const newPassword = { $set: { Password: req.body.newPassword } }
			changePassword = await Users.findOneAndUpdate(currentUser,newPassword)
			}

			console.log(req.file.filename, req.body)
		}
		catch(err){
			console.log(err)
		}
	})

// Making sure the application is running on the port I defined in the env file
app.listen(port, () => {
	console.log(`server running on ${port}`)
})

