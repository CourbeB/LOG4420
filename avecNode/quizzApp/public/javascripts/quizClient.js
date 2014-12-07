var QuizApp = angular.module("Quiz", []);

QuizApp.factory("QuestionModel", ["$http", "$log", function($http, $log) {
    return {
        getQuestionExamen: function(callback) {
            $http.get("api/getQuestionExamen")
                .success(function(data) {
                    callback(data);
                })
                .error(function(data) {
                    $log.log("Error : " + data);
                });
        },
        getQuestionRapide: function(callback) {
            $http.get("api/getQuestionRapide")
                .success(function(data) {
                    callback(data);
                })
                .error(function(data) {
                    $log.log("Error : " + data);
                });
        },
        corriger: function(reponse, type, reponses, callback) {
            $http.post("api/corriger", {reponse: reponse, type: type})
                .success(function(bonneRep) {
                    reponses.map(function (reponse) {
                        if (reponse.id == bonneRep)
                            reponse.vraie = true;
                        else
                            reponse.fausse = true;
                    });

                    callback();
                })
                .error(function(data) {
                    $log.log("Error : " + data);
                });
        }
    };
}]);