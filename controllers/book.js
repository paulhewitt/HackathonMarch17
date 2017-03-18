var async = require('async');
var axios = require('axios');

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
