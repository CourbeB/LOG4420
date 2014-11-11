var express = require('express');
var router = express.Router();
var QuizUser = require('../lib/user');
var db = require('../lib/db');

/* Route GET */
router.get('/questionRapide', function(req, res, next) {
    var user = new QuizUser(req.session);
    var nbTotal = db.getNbQuestions();
    var questionsPassees = user.getIdsQuestionsPassees();
    if (questionsPassees.length >= nbTotal) {
        questionsPassees = [];
    }

    var question = db.getRandomQuestion(null, questionsPassees);
    user.setQuestion(question);

    var data = {
        "question": question,
        "modeExamen": false,
        'stats': user.getStats()
    };
    res.render('question', data);
});

module.exports = router;
