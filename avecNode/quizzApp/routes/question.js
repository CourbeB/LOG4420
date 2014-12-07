var express = require('express');
var router = express.Router();

/* GET question examen */
router.get('/questionExamen', function(req, res) {
    res.render('question', {modeExamen: true});
});

/* GET question rapide. */
router.get('/questionRapide', function(req, res) {
    res.render('question', {modeExamen: false});
});

module.exports = router;

