var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/congra', function(req, res) {
  res.render('congra');
});

module.exports = router;
