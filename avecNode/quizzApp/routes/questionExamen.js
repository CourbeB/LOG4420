var express = require('express');
var router = express.Router();
var QuizUser = require('../lib/user');
var db = require('../lib/db');

/* Route POST (traitement du formulaire de choix des thèmes) */
router.post('/questionExamen', function(req, res) {
    var user = new QuizUser(req.session);
    var domaines = [].concat(req.body.domaine);

    user.startExam(domaines, req.body.nbQuestions);

    res.redirect("questionExamen");
});

/* Route GET */
router.get('/questionExamen', function(req, res, next) {
    var user = new QuizUser(req.session);
    var exam = user.getExam();
    if (exam) {
        var question = db.getRandomQuestion(exam.domaines, user.getIdsQuestionsPassees());
        user.setQuestion(question);

        var data = {
            "question": question,
            "noQuestion": user.getNbQuestionsPassees()+1,
            "nbQuestions": exam.nbQuestions,
            "modeExamen": true
        };
        res.render('question', data);
    }
    else {
        res.redirect("congra");
    }
});

module.exports = router;
