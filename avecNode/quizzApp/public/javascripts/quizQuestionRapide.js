$(function () {
    $("section.question > form").submit(function (event) {
        event.preventDefault();
        corrigerQuestion(this, "rapide");
    });

    $("section.question .questionSuivante").click(function () {
        window.location.href = "/questionRapide";
    });
});