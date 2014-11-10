var express = require('express');
var router = express.Router();
var QuizUser = require('../lib/user');
var db = require('../lib/db');

/* Route GET */
router.get('/questionRapide', function(req, res, next) {
    var user = new QuizUser(req.session);

    var question = db.getRandomQuestion(null, []);
    user.setQuestion(question);

    var data = {
        "question": question,
        "modeExamen": false
    };
    res.render('question', data);
});

module.exports = router;
