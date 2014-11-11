var express = require('express');
var router = express.Router();
var QuizUser = require('../lib/user');


router.get('/raz', function(req, res) {
    var user = new QuizUser(req.session);
    user.raz();

    res.redirect("tableau");
});

module.exports = router;
