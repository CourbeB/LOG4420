var abort = true;

$(function () {
    $("section.question > form").submit(function (event) {
        event.preventDefault();
        corrigerQuestion(this, "examen");
    });

    $("section.question .questionSuivante").click(function () {
        abort = false;
        window.location.href = "/questionExamen";
    });

    // Détection changement de page pour mettre 0 à l'exam
    $(window).bind("beforeunload", function (event) {
        if (abort) {
            return "Attention si vous quittez cette page vous aurez 0 à votre examen ! Êtes-vous sûr de d'abandonner ?";
        }
    });
    $(window).bind("unload", function (event) {
        if (abort) {
            window.location.href = "/congra";
        }
    });
});