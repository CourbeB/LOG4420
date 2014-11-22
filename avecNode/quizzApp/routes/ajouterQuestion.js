var express = require('express');
var router = express.Router();
var QuizUser = require('../lib/user');
var Question = require('../models/question');

/* GET home page. */
router.get('/ajouterQuestion', function(req, res) {
    res.render('ajouterQuestion');
});

router.post('/ajouterQuestion', function(req, res) {
    var reponses=req.body.reponses.split(',');
    Question.ajouterQuestion(req.body.domaine, req.body.question, reponses, parseInt(req.body.idBonneReponse));
    res.render('ajouterQuestion');
});

module.exports = router;