var crypto = require('crypto');
var bcrypt = require('bcrypt-nodejs');
var mongoose = require('mongoose');

var schemaOptions = {
  timestamps: true,
  toJSON: {
    virtuals: true
  }
};

var bookSchema = new mongoose.Schema({
  title: String,
  isbn: type: String,,
  readDate: String
}, schemaOptions);

var Book = mongoose.model('Book', bookSchema);

module.exports = Book;
