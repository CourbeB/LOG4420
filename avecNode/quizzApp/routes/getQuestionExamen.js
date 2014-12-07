var express = require('express');
var router = express.Router();
var QuizUser = require('../lib/user');
var Question = require('../models/question');

/* Route POST (traitement du formulaire de choix des thèmes) */
router.post('/questionExamen', function(req, res) {
    var user = new QuizUser(req.session);
    var domaines = [].concat(req.body.domaine);

    user.startExam(domaines, req.body.nbQuestions);

    res.redirect("questionExamen");
});

/* Route GET */
router.get('/api/getQuestionExamen', function(req, res, next) {
    var user = new QuizUser(req.session);
    var exam = user.getExam();
    if (exam) {
        Question.getRandomQuestion(exam.domaines, user.getIdsQuestionsPassees(), function(err, q) {
            user.setQuestion(q);

            var data = {
                "question": q,
                "noQuestion": user.getNbQuestionsPassees()+1,
                "nbQuestions": exam.nbQuestions,
                'stats': user.getStats()
            };
            res.send(JSON.stringify(data));
        });
    }
    else {
        //res.redirect("congra"); TODO
    }
});

module.exports = router;
