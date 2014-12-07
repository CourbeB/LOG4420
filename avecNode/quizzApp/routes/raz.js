var express = require('express');
var router = express.Router();
var QuizUser = require('../lib/user');


router.get('/raz', function(req, res) {
    var user = new QuizUser(req.session);
    user.raz(function (err) {
    	if(!err)
    		res.redirect("tableau");
    	else
    		console.log(err);
    });

});

module.exports = router;
