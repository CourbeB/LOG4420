var express = require('express');
var router = express.Router();
var QuizUser = require('../lib/user');

/* AJAX corriger */
router.post('/api/corriger', function(req, res) {
    var user = new QuizUser(req.session);
    var reussie = user.corrigerQuestion(req.body.reponse);
    var bonneRep = user.session.questionEnCours.idBonneReponse;

    if (req.body.type == 'rapide') {
        user.addQuestionTestRapide(reussie);
    }
    else {
        if (user.getNbQuestionsPassees() >= user.getExam().nbQuestions) {
            user.saveExamen();
        }
    }

    res.send(JSON.stringify(bonneRep));
});

module.exports = router;
