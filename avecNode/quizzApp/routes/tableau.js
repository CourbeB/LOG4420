var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/tableau', function(req, res) {
  res.render('tableau');
});

module.exports = router;
