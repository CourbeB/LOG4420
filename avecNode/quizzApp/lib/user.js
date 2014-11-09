/**
 * Classe QuizUser
 * Gère la persistance de session
 * @constructor
 * @param session Objet session de Express
 */
function QuizUser (_session) {
    this.session = _session;
    this.examensPasses = this.getVar("examensPasses");
    this.noteTestsRapides = this.getVar("noteTestsRapides");

    if (this.examensPasses == null) this.examensPasses = [];
    if (this.noteTestsRapides == null) this.noteTestsRapides = {
        reussies: 0,
        totales: 0
    };

    this.questionsPassees = [];
}

QuizUser.prototype = {
    /**
     * Retourne une variable stockée dans la session
     * @param variable
     * @returns {*}
     */
    getVar: function (variable) {
        return this.session[variable];
    },

    /**
     * Stocke une variable dans la session
     * @param variable
     * @param value
     */
    setVar: function (variable, value) {
        this.session[variable] = value;
    },

    /**
     * Efface le LocalStorage
     */
    raz: function () {
        this.session = {};

        this.examensPasses = [];
        this.noteTestsRapides = {
            reussies: 0,
            totales: 0
        };

        this.questionsPassees = [];
    },

    /**
     * Enregistre le résultat d'une question passée
     * @param id ID de la question
     * @param reussie
     */
    addQuestion: function (id, reussie) {
        this.questionsPassees.push({
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
            this.noteTestsRapides.reussies++;

        this.noteTestsRapides.totales++;
    },

    /**
     * Retourne les IDs des questions déjà posées
     * @returns {Array}
     */
    getIdsQuestionsPassees: function () {
        var ids = [];
        for (var id in this.questionsPassees) {
            ids.push(this.questionsPassees[id].id);
        }

        return ids;
    },

    /**
     * Retourne le nombre de questions déjà posées
     * @returns {Number}
     */
    getNbQuestionsPassees: function () {
        return this.questionsPassees.length;
    },

    /**
     * Retourne le nombre de questions réussies
     * @returns {number}
     */
    getNbQuestionsReussies: function () {
        var nb = 0;
        for (id in this.questionsPassees) {
            if (this.questionsPassees[id].reussie) {
                nb++;
            }
        }

        return nb;
    },

    /**
     * Enregistre le résultat de l'examen
     */
    saveExamen: function () {
        this.examensPasses.push({
            "date": new Date().toLocaleString(),
            "note": this.getNbQuestionsReussies()/this.getNbQuestionsPassees()
        });

        this.setVar("examensPasses", this.examensPasses);
    },

    abortExamen: function() {
        this.examensPasses.push({
            "date": new Date().toLocaleString(),
            "note": 0
        });

        this.setVar("examensPasses", this.examensPasses);
    },

    /**
     * Enregistre la note des tests rapides
     */
    saveTestRapide: function() {
        this.setVar("noteTestsRapides", this.noteTestsRapides);
    },

    /**
     * Retourne le pourcentage de réussite aux examens
     * @returns {number}
     */
    getMoyenneExamens: function () {
        var moyenne = 0;
        for (id in this.examensPasses) {
            moyenne += this.examensPasses[id].note / this.examensPasses.length;
        }

        return Math.round(moyenne*10000) / 100;
    }
};