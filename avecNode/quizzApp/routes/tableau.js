var express = require('express');
var router = express.Router();
var db = require('../lib/db');

var domainesString = JSON.stringify(db.getDomainesNbQuestion());
var domaines = db.getDomaines();

router.get('/tableau', function(req, res) {
	console.log(domaines);
    res.render('tableau',{ 	'domaines': domaines, 
    						'domainesString': domainesString});
});

module.exports = router;
