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