var express = require('express');
var router = express.Router();
var QuizUser = require('../lib/user');
var Question = require('../models/question');

router.get('/tableau', function(req, res, next) {
    var user = new QuizUser(req.session);

    Question.getDomainesNbQuestion(function(err, domaines) {
        if (err)
            next(err);

        var dList = domaines.map(function(domaine) { return domaine._id; });
        var domainesString = domaines.map(function(domaine) { return {domaine: domaine._id, nbQuestions: domaine.nbQuestions} });

        user.getStats(function (stats) {
            var data = { 	'domaines': dList,
            'domainesString': JSON.stringify(domainesString),
            'stats': stats};
            res.render('tableau',data);
        });

    });
});

module.exports = router;
