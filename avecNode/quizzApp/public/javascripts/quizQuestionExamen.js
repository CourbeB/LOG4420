$(function () {
    $("section.question > form").submit(function (event) {
        event.preventDefault();
        corrigerQuestion(this, "examen");
    });

    $("section.question .questionSuivante").click(function () {
        window.location.href = "/questionExamen";
    });
});