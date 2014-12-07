var express = require('express');
var QuizUser = require('../lib/user');
var router = express.Router();

/* GET question examen */
router.get('/questionExamen', function(req, res) {
    var user = new QuizUser(req.session);
    if (user.getExam())
        res.render('question', {modeExamen: true});
    else
        res.redirect('/tableau'); // exam non démarré
});

/* GET question rapide. */
router.get('/questionRapide', function(req, res) {
    res.render('question', {modeExamen: false});
});

module.exports = router;

