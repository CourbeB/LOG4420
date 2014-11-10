var express = require('express');
var router = express.Router();
var QuizUser = require('../lib/user');
var db = require('../lib/db');

/* Route POST (traitement du formulaire de choix des thèmes) */
router.post('/questionExamen', function(req, res) {
    var user = new QuizUser(req.session);
    user.startExam(req.body.domaine, req.body.nbQuestions);

console.log(req.session);
    res.redirect("questionExamen");
});

/* Route GET */
router.get('/questionExamen', function(req, res, next) {
    console.log(req.session);
    var user = new QuizUser(req.session);
    var exam = user.getExam();
    if (exam) {
        var question = db.getRandomQuestion(exam.domaines, user.getIdsQuestionsPassees());

        var data = {
            "question": question,
            "noQuestion": user.getNbQuestionsPassees()+1,
            "nbQuestions": exam.nbQuestions,
            "modeExamen": true
        };
        res.render('question', data);
    }
    else {
        var err = new Error("Bad Request");
        err.status = 400;
        next(err);
    }
});

module.exports = router;
