/**
 * Classe QuizUser
 * Gère la persistance de session
 * @constructor
 * @param session Objet session de Express
 */
function QuizUser (_session) {
    this.session = _session;
    this.resultats = require('../models/resultatsExamens');

    if (this.session.noteTestsRapides == null) this.session.noteTestsRapides = {
        reussies: 0,
        totales: 0
    };

    if (this.session.questionsPassees == null) this.session.questionsPassees = [];
    //if (this.session.examensPasses == null) this.session.examensPasses = [];
}

QuizUser.prototype = {
    /**
     * Efface toutes les données de session
     */
    raz: function (callback) {
        this.session.destroy();
        this.resultats.removeResultats(function (err) {
            callback(err);
        });
    },

    /**
     * Enregistre le résultat d'une question passée
     * @param id ID de la question
     * @param reussie
     */
    addQuestion: function (id, reussie) {
        this.session.questionsPassees.push({
            "id": id,
            "reussie": reussie
        });
    },

    /**
     * Ajoute le résultat d'une question test rapide à la note totale
     * @param reussie
     */
    addQuestionTestRapide: function(reussie) {
        if (reussie)
            this.session.noteTestsRapides.reussies++;

        this.session.noteTestsRapides.totales++;
    },

    /**
     * Retourne les IDs des questions déjà posées
     * @returns {Array}
     */
    getIdsQuestionsPassees: function () {
        var ids = [];
        for (var id in this.session.questionsPassees) {
            ids.push(this.session.questionsPassees[id].id);
        }

        return ids;
    },

    /**
     * Vide la liste des questions passées
     */
    clearQuestionsPassees: function() {
        this.session.questionsPassees = [];
    },

    /**
     * Retourne le nombre de questions déjà posées
     * @returns {Number}
     */
    getNbQuestionsPassees: function () {
        return this.session.questionsPassees ? this.session.questionsPassees.length : 0;
    },

    /**
     * Retourne le nombre de questions réussies
     * @returns {number}
     */
    getNbQuestionsReussies: function () {
        var nb = 0;
        for (id in this.session.questionsPassees) {
            if (this.session.questionsPassees[id].reussie) {
                nb++;
            }
        }

        return nb;
    },

    corrigerQuestion: function (reponse) {
        var reussie = (reponse == this.session.questionEnCours.idBonneReponse);
        this.addQuestion(this.session.questionEnCours._id, reussie);

        return reussie;
    },

    setQuestion: function (question) {
        this.session.questionEnCours = question;
    },

    /**
     * Démarre un examen
     * @param domaines
     * @param nbQuestions
     */
    startExam: function (domaines, nbQuestions) {
        this.session.examEnCours = {
            "domaines": domaines,
            "nbQuestions": nbQuestions
        };

        this.clearQuestionsPassees();
    },

    /**
     * Retourne l'exam en cours
     * @returns {{domaines: *, nbQuestions: *}|*}
     */
    getExam: function () {
        return this.session.examEnCours;
    },

    /**
     * Enregistre le résultat de l'examen
     */
    saveExamen: function (callback) {
        var self = this;
        self.resultats.sauveExamen((self.getNbQuestionsReussies()/self.getNbQuestionsPassees())*100, new Date(),self.getExam().domaines, function (err) {
            self.session.examEnCours = null;
            self.session.questionEnCours = null;
            self.session.questionsPassees = [];
            callback(err);
        });
    },

    /**
     * Abandonne l'examen en cours
     */
    abortExamen: function(callback) {
        var self = this;
        self.resultats.abortExamen(new Date(), self.getExam().domaines, function () {
            self.session.examEnCours = null;
            self.session.questionEnCours = null;
            self.session.questionsPassees = [];
            callback(err, res);
        });
    },

    /**
     * Retourne le pourcentage de réussite aux examens
     * @returns {number}
     */
    getMoyenneExamens: function (callback) {
        this.resultats.getMoyenneExamens(function (err, moyenne) {
            var moy = moyenne[0] == undefined ? 0 : moyenne[0].moyenne;
            //res = Math.round(moyenne);
            callback(err, moy);
        });
    },

    getExamens: function (callback) {
        this.resultats.getExamens(function (err, examens) {
            callback(err, examens);
        });
    },

    getDernierExam: function (callback) {
        this.resultats.getDernierExam(function (err, res) {
            callback(err, res)
        });
    },

    /**
     * Retourne les stats
     * @returns {{nbQuestionsReussies: number, nbQuestionsPassees: Number, noteTestsRapides: *, moyenneExamens: number}|*}
     */
    getStats: function (callback) {
        var self = this;
        stats = {
            noteTestsRapides: self.session.noteTestsRapides
        };

        self.getMoyenneExamens(function(err, moyenne) {
            if (!err) {
                stats.moyenneExamens = moyenne;

                self.getExamens(function(err, examens) {
                    if (!err) {
                        stats.exams = examens;
                        //console.log(stats);
                        callback(stats);
                    }
                    else
                        console.log(err);
                });
            }
            else
                console.log(err);
        });
    }
};

module.exports = QuizUser;