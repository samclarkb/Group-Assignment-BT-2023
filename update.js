// Require external data/functions
const express = require('express')
const expressLayouts = require('express-ejs-layouts')
const dotenv = require('dotenv').config()
const bodyParser = require('body-parser')
const mongoose = require('mongoose')
const updateTest = require('./models/models')

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

// Get request update page 
app.get('/update', (req, res) => {
		res.render('update')
	})

// update email
app.post('/update', async (req, res) => {
		console.log('req', req.body.newEmail)

		const { email, newEmail } = req.body
		try{
			const email = await updateTest.find({ Email: req.body.email })

			updateTest.updateOne({ Email: req.body.newEmail })
			.then(() => console.log('email updated'))
		}
		catch(e){
			console.log('error', e)
		}
	})
// Making sure the application is running on the port I defined in the env file
app.listen(3333, () => {
	console.log(`server running on 3333`)
})
