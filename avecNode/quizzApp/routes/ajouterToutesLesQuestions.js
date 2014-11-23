var express = require('express');
var router = express.Router();
var QuizUser = require('../lib/user');
var Question = require('../models/question');

router.get('/ajouterToutesLesQuestions', function(req, res) {
    res.render('ajouterToutesLesQuestions');
});

router.post('/ajouterToutesLesQuestions', function(req, res) {
	var lesQuestions = JSON.parse(req.body.lesQuestions);
    Question.ajouterToutesLesQuestions(lesQuestions, function(){
    	res.render('ajouterToutesLesQuestions');
    });
    
});

module.exports = router;