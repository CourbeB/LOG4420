function corrigerQuestion (form, type) {
    $("input[type=radio]", form).prop("disabled", true);

    $.post("/corriger", {"reponse": $("input[type=radio]:checked", form).val(), "type": type}, function (data, status) {
        if (status == "success") {
            $("input[type=radio]", form).each(function () {
                $(this).parent().addClass($(this).val() == data ? "repVraie" : "repFausse");

                $("button[type=submit]", form).hide();
                $(".questionSuivante", form).show();
            });
        }
    });
}