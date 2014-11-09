var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/regles', function(req, res) {
  res.render('regles');
});

module.exports = router;
