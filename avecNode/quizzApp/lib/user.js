/**
 * Classe QuizUser
 * Gère la persistance de session
 * @constructor
 * @param session Objet session de Express
 */
function QuizUser (_session) {
    this.session = _session;

    if (this.session.noteTestsRapides == null) this.session.noteTestsRapides = {
        reussies: 0,
        totales: 0
    };

    if (this.session.questionsPassees == null) this.session.questionsPassees = [];
    if (this.session.examensPasses == null) this.session.examensPasses = [];
}

QuizUser.prototype = {
    /**
     * Efface toutes les données de session
     */
    raz: function () {
        this.session = {};
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
        var reussie = reponse == this.session.questionEnCours.idBonneReponse;
        this.addQuestion(this.session.questionEnCours.id, reussie);

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
    saveExamen: function () {
        this.session.examensPasses.push({
            "date": new Date().toLocaleString(),
            "note": this.getNbQuestionsReussies()/this.getNbQuestionsPassees()
        });

        this.session.examEnCours = null;
        this.session.questionEnCours = null;
    },

    /**
     * Abandonne l'examen en cours
     */
    abortExamen: function() {
        this.session.examensPasses.push({
            "date": new Date().toLocaleString(),
            "note": 0
        });
    },

    /**
     * Retourne le pourcentage de réussite aux examens
     * @returns {number}
     */
    getMoyenneExamens: function () {
        var moyenne = 0;
        for (id in this.session.examensPasses) {
            moyenne += this.session.examensPasses[id].note / this.session.examensPasses.length;
        }

        return Math.round(moyenne*10000) / 100;
    }
};

module.exports = QuizUser;