const mongoose = require('mongoose');

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
})

const Albums = mongoose.model('Albums', albumSchema, 'Albums')

module.exports = Albums

const userSchema = new mongoose.Schema( {
	Email: String,
	Like: Array,
	Password: String,
	Profilepic: {
		data: String,
		contentType: String,
	},
	Username: String,
})
const Users = mongoose.model('Users', userSchema, 'Users')
module.exports = Users
