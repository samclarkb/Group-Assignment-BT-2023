const mongoose = require('mongoose')

const albumSchema = new mongoose.Schema({
	Title: String,
	Artist: String,
	Genre: String,
	Year: String,
	Image: {
		data: String,
		contentType: String,
	},
	Description: String,
	Like: Boolean,
	SpotifyLink: String,
})

const userSchema = new mongoose.Schema({
	Email: String,
	Like: Array,
	Password: String,
	Profilepic: {
		data: String,
		contentType: String,
	},
	Username: String,
})

const Albums = mongoose.model('Albums', albumSchema, 'Albums')
const Users = mongoose.model('Users', userSchema, 'Users')
module.exports = { Users, Albums }
