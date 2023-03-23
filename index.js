console.log('test github push')
// Require external data/functions
const express = require('express')
const multer = require('multer')
const expressLayouts = require('express-ejs-layouts')
const dotenv = require('dotenv').config()
const bodyParser = require('body-parser')
const mongoose = require('mongoose')
const session = require('express-session')
const { Albums, Users } = require('./models/models')

// Defining express as app
const app = express()

// creating a session
app.use(session({
	secret: process.env.SESSION_KEY,
	resave: true,
	saveUninitialized: true,
	cookie: { maxAge: 60000 }
}));

// check if user is authorized (logged in) to visit a page
const authorizeUser = (req, res, next) => {
	if (!req.session.user) {
		// res.send('<h1>unauthorized</h1>');
		res.render('unauthorized');
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
	res.render('inloggen')
})
	.get('/results', authorizeUser, async (req, res) => {
		const fetchAlbums = await Albums.find({})
		res.render('results', { data: fetchAlbums })
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
		const fetchFavorite = await Albums.find({ Like: true })
		res.render('favorites', { data: fetchFavorite })
	})
	.get('/deleteModal:id', authorizeUser, async (req, res) => {
		console.log('req', req.params.id)
		const fetchAlbum = await Albums.find({ _id: req.params.id })
		res.render('deleteModal', { data: fetchAlbum })
	})
	.get('/add', authorizeUser, (req, res) => {
		res.render('add')
	})
	.get('/all', authorizeUser, async (req, res) => {
		const fetchAlbums = await Albums.find({}).sort({ _id: -1 })
		res.render('all', { data: fetchAlbums })
	})
	.get('*', (req, res) => {
		res.status(404).render('404')
	})

// All Post requests
app.post('/home', async (req, res) => {
	const checkUser = await Users.find({ Email: req.body.email, Password: req.body.password });
	// console.log(checkUser);
	// console.log(checkUser[0]['_id']);
	if (checkUser.length !== 0) {
		req.session.user = { userID: checkUser[0]['_id'] }
		console.log(req.session.user);
		res.render('preference')
	} else {
		res.redirect('/');
	}
})

app.post('/logout', (req, res) => {
	console.log(req.session.user);
	req.session.destroy()
	res.redirect('/')
})

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

// Making sure the application is running on the port I defined in the env file
app.listen(port, () => {
	console.log(`server running on ${port}`)
})
