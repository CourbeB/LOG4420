var express = require('express');
var router = express.Router();
var QuizUser = require('../lib/user');
var Question = require('../models/question');

/* Route GET */
router.get('/questionRapide', function(req, res, next) {
    var user = new QuizUser(req.session);

    Question.getNbQuestions([], function(err, nbTotal) {
        if (err)
            next(err);

        if (user.getNbQuestionsPassees() >= nbTotal) {
            user.clearQuestionsPassees();
        }

        var questionsPassees = user.getIdsQuestionsPassees();
        Question.getRandomQuestion([], questionsPassees, function(err, q) {
            user.setQuestion(q);

            var data = {
                "question": q,
                "modeExamen": false,
                'stats': user.getStats()
            };

            res.render('question', data);
        });
    });
});

module.exports = router;
