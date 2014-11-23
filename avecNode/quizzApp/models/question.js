var mongoose   = require('mongoose');
var random = require('mongoose-simple-random');
var Schema = mongoose.Schema;

var q = new Schema({
    domaine: String,
    question: String,
    idBonneReponse: Number,
    reponses: [{
        id: Number,
        value: String
    }]
}, {collection: "Questions"});
q.plugin(random);

var question = mongoose.model('Question', q);

module.exports = {
    /**
     * Retourne les domaines de questions disponibles
     * @param callback function(err, res)
     */
    getDomaines: function (callback) {
        question.distinct("domaine", function(err, res) {
            callback(err, res);
        });
    },

    /**
     * Retourne le nombre de questions des domaines passés en paramètre
     * @param domaines Array|null Si null, tous les domaines sont pris en compte
     * @param callback function(err, res)
     */
    getNbQuestions: function (domaines, callback) {
        var filter = (domaines != null && domaines.length > 1) ? {domaine: domaines} : {};

        question.count(filter, function(err, res) {
            callback(err, res);
        });
    },

    /**
     * Retourne une liste d'objets (domaine, nombre de questions)
     * @param callback function(err, res)
     */
    getDomainesNbQuestion: function (callback) {
        question.aggregate([{$group: {_id: "$domaine", nbQuestions: {$sum: 1}}}], function(err, res) {
            callback(err, res);
        });
    },

    /**
     * Retourne toutes les questions des domaines passés en paramètre
     * @param domaines
     * @param callback function(err, res)
     */
    getQuestions:  function (domaines, callback) {
        question.find({domaine: domaines}, function(err, res) {
            callback(err, res);
        });
    },

    /**
     * Retourne une question au hasard parmis les domaines passés en paramètre, sans retourner une question déjà posée
     * @param domaines Array|null Si null, tous les domaines sont pris en compte
     * @param questionsPassees IDs des questions déjà posées
     * @param callback function(err, res)
     */
    getRandomQuestion: function (domaines, questionsPassees, callback) {
        var filter = (domaines != null && domaines.length >= 1) ? {domaine: {$in: domaines}, _id: {$nin: questionsPassees}} : {_id: {$nin: questionsPassees}};

        question.findOneRandom(filter, function(err, res) {
            callback(err, res);
        });
    },

    ajouterToutesLesQuestions: function(lesQuestions, callback){
        /*for (var i = 0; i < lesQuestions.length; i++) {
            var ques = new question({
            domaine: lesQuestions[i].domaine
            , question: lesQuestions[i].question
            , idBonneReponse: lesQuestions[i].idVrai
            });

            var tmp = lesQuestions[i].reponses.map(function(reponse) { return reponse.value; });
            var tab = JSON.parse(JSON.stringify(ques)).reponses;
            for (var i = 0; i < tmp.length; i++) {
                var newReponse = {"id":i+1, "value":tmp[i]};
                tab.push(newReponse);
            };
            ques.reponses = tab;
            ques.save(function(err, ques) {
                if (err) return console.error(err);
                console.dir(ques);
            });
        };*/

        function ajouter(questions, callback){
            var laQuestion = questions.pop();
            var ques = new question({
                domaine: laQuestion.domaine
                , question: laQuestion.question
                , idBonneReponse: laQuestion.idVrai
            });

            var tmp = laQuestion.reponses.map(function(reponses){return reponses.value;});
            var tab = [];
            for (var i = 0; i < tmp.length; i++) {
                var newReponse = {"id":i+1, "value":tmp[i]};
                tab.push(newReponse);
            };
            ques.reponses = tab;

            ques.save(function(err, ques) {
                if (err) return console.error(err);

                if (questions.length <= 0) {
                    callback();
                }
                else {
                    ajouter(questions, callback);
                }  
            });
        }

        ajouter(lesQuestions, callback);
    },

    ajouterQuestion: function(domaine, laquestion, reponses, idBonneReponse, callback){
        var ques = new question({
        domaine: domaine
        , question: laquestion
        , idBonneReponse: idBonneReponse
        });

        var tab = JSON.parse(JSON.stringify(ques)).reponses
        for (var i = 0; i < reponses.length; i++) {
            var newReponse = {"id":i+1, "value":reponses[i]};
            tab.push(newReponse);
        };
        ques.reponses = tab;
        ques.save(function(err, res) {
            callback(err, res);
        });
    }
};