var async = require('async');
var axios = require('axios');
var Book = require('../models/Book');
var moment = require('moment');

/**
 * GET /login
 */
exports.bookGet = function(req, res) {
  if (req.user) {
    return res.redirect('/');
  }
  res.render('account/login', {
    title: 'Log in'
  });
};

exports.userBooksGet = function(req, res) {
  const userId = 10208029043146470; //req.user.facebook
  Book.find({ userFbId: userId }, function (err, books) {
    if (err) {
      res.sendStatus(500);
      return handleError(err);
    }
    res.json(books);
  })
}

exports.topBooksGet = function(req, res) {
  const filter = req.params.filter;
  var queryFilter = moment.now();
  console.log(queryFilter);
  if (filter === 'day') {
    queryFilter = moment().startOf('day').valueOf()
  }
  if (filter === 'week') {
    queryFilter = moment().startOf('week').valueOf()
  }
  if (filter === 'month') {
    queryFilter = moment().startOf('month').valueOf()
  }
  console.log(queryFilter);
  Book.find({
    readDate: {
        $gte: queryFilter,
    }
  }, function (err, books) {
    if (err) {
      res.sendStatus(500);
      return handleError(err);
    }
    res.json(books);
  })
}

exports.bookPost = function(req, res) {
  const userId = req.user.facebook;
  const title = req.body.title;
  const isbn = req.body.isbn;
  const rating = req.body.rating;
  const comment = req.body.comment;
  const readDate = moment.now();

  if (!userId || !title || !isbn) {
    res.status(302).json({message: 'Required params: userId, title, isbn'});
    return;
  }

  var book = new Book({
    userFbId: userId,
    title,
    isbn,
    readDate,
    rating,
    comment
  });

  book.save(function(err) {
    if (err) return handleError(err);
    console.log('book saved');
    res.sendStatus(201);
  });
}

exports.searchGet = function(req, res) {
  // https://www.googleapis.com/books/v1/volumes?q=0825626641
  const { q } = req.query;
  if (!q) {
    res.status(404).json({message: 'Missing search param'});
    return;
  }

  axios.get('https://www.googleapis.com/books/v1/volumes?q='+q)
  .then(function (response) {
    console.log(response.data);
    res.json(response.data);
  })
  .catch(function (error) {
    console.log(error);
    res.sendStatus(500);
  });
}
