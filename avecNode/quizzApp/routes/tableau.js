var express = require('express');
var router = express.Router();
var db = require('../lib/db');
var QuizUser = require('../lib/user');

var domainesString = JSON.stringify(db.getDomainesNbQuestion());
var domaines = db.getDomaines();

router.get('/tableau', function(req, res) {
    var user = new QuizUser(req.session);
	var data = { 	'domaines': domaines,
        'domainesString': domainesString,
        'stats': user.getStats()};

    res.render('tableau',data);
});

module.exports = router;
