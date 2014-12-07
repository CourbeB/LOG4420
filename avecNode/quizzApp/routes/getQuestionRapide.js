var express = require('express');
var router = express.Router();
var QuizUser = require('../lib/user');
var Question = require('../models/question');

/* Route GET */
router.get('/api/getQuestionRapide', function(req, res, next) {
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

<<<<<<< HEAD:avecNode/quizzApp/routes/questionRapide.js
            user.getStats(function (stats) {
                var data = {
                    "question": q,
                    "modeExamen": false,
                    'stats': stats
                };
            });
=======
            var data = {
                "question": q,
                'stats': user.getStats()
            };
>>>>>>> origin/master:avecNode/quizzApp/routes/getQuestionRapide.js

            res.send(JSON.stringify(data));
        });
    });
});

module.exports = router;
