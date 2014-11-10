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
            json.listeQuestions[idQ].question);

        // Ajout des réponses
        for (var idR in json.listeQuestions[idQ].reponses) {
            this.questions[json.listeQuestions[idQ].id].addReponse(
                json.listeQuestions[idQ].reponses[idR].id,
                json.listeQuestions[idQ].reponses[idR].value,
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
     * Retourne un dico (domaine, nombre de questions)
     * @returns {dico}
     */

    getDomainesNbQuestion: function () {
        var dico = [];
        var cles = this.getDomaines();
        for (var cle in cles){
            dico.push({
                "domaine" : cles[cle],
                "nbQuestions": this.getNbQuestions([cles[cle]])
            });
        }
        return dico;
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
            if (questionsPassees.indexOf(questions[k].id) == -1) { // Si la question n'est pas déjà passée, on l'ajoute
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

/* MODULE NODEJS */
var questions = {
    "listeQuestions":[
        {
            "id": 1,
            "domaine": "HTML",
            "question":"Que veut dire HTML ?",
            "reponses":[
                {"value":"Hypertext Markup Language","id":1},
                {"value":"Haute Tension Monitorée Linéairement","id":2}
            ],
            "idVrai":1
        },


        {
            "id": 2,
            "domaine": "HTML",
            "question":"La balise body est-elle obligatoire en HTML 5 ?",
            "reponses":[
                {"value":"Oui","id":1},
                {"value":"Non","id":2}
            ],
            "idVrai":2
        },


        {
            "id": 3,
            "domaine": "HTML",
            "question":"Qui fait les standards du Web ?",
            "reponses":[
                {"value":"Mozilla","id":1},
                {"value":"Le World Wide Web Consortium","id":2},
                {"value":"Google","id":3}
            ],
            "idVrai":2
        },


        {
            "id": 4,
            "domaine": "HTML",
            "question":"Quelle est la balise nécessaire pour faire un retour à la ligne ?",
            "reponses":[
                {"value":"<break/>","id":1},
                {"value":"<br/>","id":2},
                {"value":"<lb/>","id":3}
            ],
            "idVrai":2
        },


        {
            "id": 5,
            "domaine": "CSS",
            "question":"CSS3 possède un sélecteur pour permettre de sélectionner un parent.",
            "reponses":[
                {"value":"Oui","id":1},
                {"value":"Non","id":2}
            ],
            "idVrai":2
        },


        {
            "id": 6,
            "domaine": "CSS",
            "question":"Comment fait-on référence à une fichier CSS externe dans une page HTML ?",
            "reponses":[
                {"value":"<stylesheet>mystyle.css</stylesheet>","id":1},
                {"value":"<link rel=\"stylesheet\" type=\"text/css\" href=\"mystyle.css\"/>","id":2}
            ],
            "idVrai":2
        },


        {
            "id": 7,
            "domaine": "CSS",
            "question":"Quelle balise utilise-t-on pour définir un style interne à la page ?",
            "reponses":[
                {"value":"<css>","id":1},
                {"value":"<style>","id":2}
            ],
            "idVrai":2
        },


        {
            "id": 8,
            "domaine": "JS",
            "question":"Comment insérer du code Javascript dans une page HTML ?",
            "reponses":[
                {"value":"<js>","id":1},
                {"value":"<script>","id":2}
            ],
            "idVrai":2
        },


        {
            "id": 9,
            "domaine": "JS",
            "question":"Comment commenter du code Javascript ?",
            "reponses":[
                {"value":"# un commentaire","id":1},
                {"value":"/* un commentaire*/","id":2}
            ],
            "idVrai":2
        },

        {
            "id": 10,
            "domaine": "JS",
            "question":"Comment insérer un fichier Javascript dans une page HTML ?",
            "reponses":[
                {"value":"<javascript src=\"xxx.js\"></javascript>","id":1},
                {"value":"<script type=\"text/javascript\" src=\"xxx.js\"></script>","id":2}
            ],
            "idVrai":2
        }

    ]
};

var bd = new QuizBd(questions);
module.exports = bd;