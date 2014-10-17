/* BD */
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
    getDomaines: function () {
        var cles = [];
        for (var cle in this.domaines) {
            cles.push(cle);
        }

        return cles;
    },

    getNbQuestions: function (domaines) {
        var nb = 0;
        for (var k in domaines) {
            nb += this.domaines[domaines[k]].length;
        }

        return nb;
    },

    getQuestions:  function (domaines) {
        var questions = [];
        for (var k in domaines) {
            questions = questions.concat(this.domaines[domaines[k]]);
        }

        return questions;
    },

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

/* QUESTION */
function QuizQuestion (_id, _domaine, _question) {
    this.id = _id;
    this.domaine = _domaine;
    this.question = _question;
    this.idBonneReponse = null;

    this.reponses = {};
}

QuizQuestion.prototype = {
    addReponse: function (id, reponse, bonne) {
        this.reponses[id] = new QuizReponse(id, reponse, bonne);
        if (bonne)
            this.idBonneReponse = id;
    }
};

/* REPONSE */
function QuizReponse (_id, _reponse, _bonne) {
    this.id = _id;
    this.reponse = _reponse;
    this.bonne = _bonne;
}

/* Fonctions utiles */
function safe_tags(str) {
    return str.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;') ;
}