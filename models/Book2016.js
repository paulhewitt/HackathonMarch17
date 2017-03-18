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
  ISBN: String
}, schemaOptions);

var Book2016 = mongoose.model('Book2016', bookSchema);

module.exports = Book2016;
