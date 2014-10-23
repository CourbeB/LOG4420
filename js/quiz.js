/**
 * Retourne les paramètres de l'examen envoyés en GET
 * @returns {{domaines: Array, nbQuestions: number}}
 */
function getExamParams () {
    var params = {
        domaines: [],
        nbQuestions: 0
    };

    document.location.search.replace(/\??(?:([^=]+)=([^&]*)&?)/g, function () {
        if (arguments[1] == "domaine") {
            params.domaines.push(arguments[2]);
        }
        else {
            params[arguments[1]] = arguments[2];
        }
    });

    return params;
}

/**
 * Affiche la question suivante, et la retourne
 * @param bd QuizBd
 * @param user QuizUser
 * @param form Objet jQuery du formulaire
 * @param domaines Array|null
 * @param nbtotal number|null
 * @returns {QuizQuestion}
 */
function afficherNouvelleQuestion (bd, user, form, domaines, nbtotal) {
    var question = bd.getRandomQuestion(domaines, user.getIdsQuestionsPassees());

    var titre = "Question " + (user.getNbQuestionsPassees()+1);

    if (nbtotal != null) {
        titre += " / " + nbtotal;
    }

    $("> h1", form).html(titre).data("theme", question.domaine);
    $("> h1 + div > p", form).html(question.question);

    $("> h1 + div > label", form).remove();
    $.each(question.reponses, function () {
        $("> h1 + div", form).append('<label><input type="radio" name="rep" value="'+ this.id +'"/> '+ this.reponse +'</label>');
    });

    return question;
}

/**
 * Corrige la question en cours
 * @param question QuizQuestion
 * @param form Objet jQuery du formulaire
 * @returns bool Réussie
 */
function corrigerQuestion (question, form) {
    $("input[type=radio]", form).prop("disabled", true);
    $("input[type=radio]", form).each(function () {
        $(this).parent().addClass(question.reponses[$(this).val()].bonne ? "repVraie" : "repFausse");
    });

    var reussie = $("input[type=radio][value='"+ question.idBonneReponse +"']", form).prop("checked");
    user.addQuestion(question.id, reussie);

    return reussie;
}

/**
 * Affiche les statistiques de l'utilisateur
 * @param user QuizUser
 * @param box Objet jQuery de la box de statistiques
 * @param testEnCours bool Afficher ou non les résultats du test en cours
 */
function afficherStats (user, box, testEnCours) {
    $("> h1 + ul", box).empty();

    if (testEnCours) {
        $("> h1 + ul", box).append("<li>Test en cours : "+ user.getNbQuestionsReussies() +" / "+ user.getNbQuestionsPassees() +"</li>");
    }

    $("> h1 + ul", box).append("<li>Note tests rapides : "+ user.noteTestsRapides.reussies +" / "+ user.noteTestsRapides.totales +"</li>");
    $("> h1 + ul", box).append("<li>Moyenne des examens passés : "+ user.getMoyenneExamens() +" %</li>");
}

/**
 * Affiche l'historique des examens
 * @param user QuizUser
 * @param box Objet jQuery de la box d'historique
 */
function afficherHistoExamens (user, box) {
    $("> section > h1 + ul", box).empty();

    if (user.examensPasses.length > 0) {
        for (id in user.examensPasses) {
            $("> section > h1 + ul", box).append("<li>"+ user.examensPasses[id].date +" : "+ user.examensPasses[id].note * 100 +" %</li>");
        }
    }
    else {
        $("> section > h1 + ul", box).append("<li>Pas d'examen passé</li>");
    }
}