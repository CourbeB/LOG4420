/**
 * Classe QuizBd
 * Gère la liste des questions
 * @param json Base de données des questions (tableau associatif)
 * @constructor
 */
function QuizBd (json) {
    this.questions = {};
    this.domaines = {};

    for (var idQ in json.listeQuestions) {
        // Ajout de la question à la liste globale
        this.questions[json.listeQuestions[idQ].id] = new QuizQuestion(
            json.listeQuestions[idQ].id,
            json.listeQuestions[idQ].domaine,
            safe_tags(json.listeQuestions[idQ].question));

        // Ajout des réponses
        for (var idR in json.listeQuestions[idQ].reponses) {
            this.questions[json.listeQuestions[idQ].id].addReponse(
                json.listeQuestions[idQ].reponses[idR].id,
                safe_tags(json.listeQuestions[idQ].reponses[idR].value),
                json.listeQuestions[idQ].reponses[idR].id == json.listeQuestions[idQ].idVrai
            );
        }

        // Ajout de la question à la liste par domaine
        if (typeof(this.domaines[json.listeQuestions[idQ].domaine]) == "undefined") {
            this.domaines[json.listeQuestions[idQ].domaine] = []; // Si le domaine n'existe pas, on le créé
        }
        this.domaines[json.listeQuestions[idQ].domaine].push(this.questions[json.listeQuestions[idQ].id]);
    }
}

QuizBd.prototype = {
    /**
     * Retourne les domaines de questions disponibles
     * @returns {Array}
     */
    getDomaines: function () {
        var cles = [];
        for (var cle in this.domaines) {
            cles.push(cle);
        }

        return cles;
    },

    /**
     * Retourne le nombre de questions des domaines passés en paramètre
     * @param domaines
     * @returns {number}
     */
    getNbQuestions: function (domaines) {
        var nb = 0;
        for (var k in domaines) {
            nb += this.domaines[domaines[k]].length;
        }

        return nb;
    },

    /**
     * Retourne toutes les questions des domaines passés en paramètre
     * @param domaines
     * @returns {Array}
     */
    getQuestions:  function (domaines) {
        var questions = [];
        for (var k in domaines) {
            questions = questions.concat(this.domaines[domaines[k]]);
        }

        return questions;
    },

    /**
     * Retourne une question au hasard parmis les domaines passés en paramètre, sans retourner une question déjà posée
     * @param domaines Array|null Si null, tous les domaines sont pris en compte
     * @param questionsPassees IDs des questions déjà posées
     * @returns QuizQuestion
     */
    getRandomQuestion: function (domaines, questionsPassees) {
        if (domaines == null) // Si pas de domaines passés, il s'agit de tous les domaines
            domaines = this.getDomaines();

        var questions = this.getQuestions(domaines);
        var questionsRestantes = [];

        for (var k in questions) {
            if (!(questions[k].id in questionsPassees)) { // Si la question n'est pas déjà passée, on l'ajoute
                questionsRestantes.push(questions[k]);
            }
        }

        var randomId = Math.floor(Math.random() * (questionsRestantes.length - 1));
        return questionsRestantes[randomId];
    }
};

/**
 * Classe QuizQuestion
 * @param _id
 * @param _domaine
 * @param _question
 * @constructor
 */
function QuizQuestion (_id, _domaine, _question) {
    this.id = _id;
    this.domaine = _domaine;
    this.question = _question;
    this.idBonneReponse = null;

    this.reponses = {};
}

QuizQuestion.prototype = {
    /**
     * Ajoute une réponse à la question
     * @param id
     * @param reponse
     * @param bonne
     */
    addReponse: function (id, reponse, bonne) {
        this.reponses[id] = new QuizReponse(id, reponse, bonne);
        if (bonne)
            this.idBonneReponse = id;
    }
};

/**
 * Classe QuizReponse
 * @param _id
 * @param _reponse
 * @param _bonne
 * @constructor
 */
function QuizReponse (_id, _reponse, _bonne) {
    this.id = _id;
    this.reponse = _reponse;
    this.bonne = _bonne;
}

/* ### Fonctions utiles ### */
/**
 * Remplace les caractères spéciaux HTML <, > et & par leur code XML
 * @param str
 * @returns {XML|string}
 */
function safe_tags(str) {
    return str.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;') ;
}