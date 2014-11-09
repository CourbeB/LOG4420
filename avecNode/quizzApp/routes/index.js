var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res) {
  res.render('index');
});

router.get('/tableau', function(req, res) {
  res.render('tableau');
});


router.get('/regles', function(req, res) {
  res.render('regles');
});

router.get('/congra', function(req, res) {
  res.render('congra');
});

module.exports = router;
