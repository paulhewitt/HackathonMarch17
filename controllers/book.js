var async = require('async');
var axios = require('axios');
var Book = require('../models/Book');
var Book2016 = require ('../models/Book2016');
var moment = require('moment');

exports.bookGet = function(req, res) {
  const isbn = req.query.isbn;
  axios.get('https://www.googleapis.com/books/v1/volumes?q='+isbn)
  .then(function (response) {
    Book.find({ isbn }, function (err, books) {
      const book = response.data.items[0];
      const comments = [];

      if (err) {
        res.sendStatus(500);
        return handleError(err);
      }
      for (var b in books) {
        comments.push(books[b].comment);
      }
      res.render('book', {book, comments});
    });
  })
  .catch(function (error) {
    console.log(error);
    res.render('home');
  });
}

exports.userBooksGet = function(req, res) {
  const userId = 10208029043146470; //req.user.facebook
  Book.find({ userFbId: userId }, function (err, books) {
    if (err) {
      res.sendStatus(500);
      return handleError(err);
    }
    res.json(books);
  });
}

exports.test = function(req, res) {
  for (var i=0;i<50;i++) {
    var titles = ['Harry P', 'Tay is great', 'Big Cool Dads'];
    var isbn = ['1234567891234', '555345', '57575757'];
    var index = Math.floor(Math.random()*3);
    var book = new Book({
      userFbId: '10208029043146470',
      title: titles[index],
      isbn: isbn[index],
      readDate: moment().valueOf(),
      rating: 'like',
      comment: ''
    });
    book.save(function(err) {
      if (err) return handleError(err);
      console.log('book saved');
    });
  }
}

exports.topBooks2016Get = function(req, res) {
  console.log('eh')
  Book2016.find({}, function (err, books) {
    if (err) {
      res.sendStatus(500);
      return handleError(err);
    }
    console.log(books);
    var bookList = {};
    var itemCount = books.length;
    console.log(books.length);
    books.forEach(function (book, iter) {

      if (!bookList[book.ISBN]) {
        bookList[book.ISBN] = book
        bookList[book.ISBN].score = 1;
      }
      else
        bookList[book.ISBN].score ++;

      if (itemCount == (iter+1)) {
        var sortable = [];
        for (var book in bookList) {
            sortable.push([bookList[book], bookList[book].score]);
        }
        sortable.sort(function(a, b) {
            return b[1] - a[1];
        });
        res.json(sortable.slice(0, req.query.limit || 10));
      }
    });
  })
}

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

exports.test = function(req, res) {
  for (var i=0;i<50;i++) {
    var titles = ['Harry P', 'Tay is great', 'Big Cool Dads'];
    var isbn = ['1234567891234', '555345', '57575757'];
    var index = Math.floor(Math.random()*3);
    var book = new Book({
      userFbId: '10208029043146470',
      title: titles[index],
      isbn: isbn[index],
      readDate: moment().valueOf(),
      rating: 'like',
      comment: ''
    });
    book.save(function(err) {
      if (err) return handleError(err);
      console.log('book saved');
    });
  }
}

exports.topBooksGet = function(req, res) {
  const filter = req.params.filter;
  var queryFilter = moment.now();
  if (filter === 'day') {
    queryFilter = moment().startOf('day').valueOf()
  }
  if (filter === 'week') {
    queryFilter = moment().startOf('week').valueOf()
  }
  if (filter === 'month') {
    queryFilter = moment().startOf('month').valueOf()
  }
  Book.find({
    readDate: {
        $gte: queryFilter,
    }
  }, function (err, books) {
    if (err) {
      res.sendStatus(500);
      return handleError(err);
    }
    var bookList = {};
    var itemCount = books.length;
    books.forEach(function (book, iter) {
      if (!bookList[book.isbn]) {
        bookList[book.isbn] = book
        bookList[book.isbn].score = 1;
      }
      else
        bookList[book.isbn].score ++;

      if (itemCount == (iter+1)) {
        var sortable = [];
        for (var book in bookList) {
            sortable.push([bookList[book], bookList[book].score]);
        }
        sortable.sort(function(a, b) {
            return b[1] - a[1];
        });
        res.json(sortable.slice(0, req.query.limit || 10));
      }
    });
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
