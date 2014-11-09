var express = require('express');
var router = express.Router();
var QuizUser = require('../lib/user');

/* Route POST (traitement du formulaire de choix des thèmes) */
router.post('/questionExamen', function(req, res) {
    console.log(req.body);

    var user = new QuizUser(req.session);
    console.log(user);
});

/* Route GET */
router.get('/questionExamen', function(req, res) {
   // res.render('question');
});

module.exports = router;
