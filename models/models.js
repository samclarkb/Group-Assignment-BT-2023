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

const testSchema = new mongoose.Schema({
	Name: String,
	Email: String,
})

const Albums = mongoose.model('Albums', albumSchema, 'Albums')
const updateTest = mongoose.model('updateTest', testSchema, 'updateTest')

module.exports.Albums = Albums
module.exports.updateTest = updateTest