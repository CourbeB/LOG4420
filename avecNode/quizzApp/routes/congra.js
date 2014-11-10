var express = require('express');
var router = express.Router();
var QuizUser = require('../lib/user');

/* GET home page. */
router.get('/congra', function(req, res) {
    var user = new QuizUser(req.session);
    var data = {};
    data.note = user.session.examensPasses[user.session.examensPasses.length-1].note*100;

    if(data.note<=25)
        data.desc = "Il fait vraiment travailler plus.";
    if(data.note>25 && data.note<= 50)
        data.desc ="Peut mieux faire, il faut continuer à travailler.";
    if(data.note>50 && data.note<= 75)
        data.desc ="Continue ainsi!";
    if(data.note>75 && data.note<= 100)
        data.desc ="Bon travail!";

    res.render('congra', data);
});

module.exports = router;
