QuizApp.controller("QuestionRapideControlleur", ["$scope", "QuestionModel", function($scope, QuestionModel) {
    $scope.corriger = function () {
        QuestionModel.corriger($scope.userReponse, "rapide", $scope.question.reponses, function() {
            $scope.status = 'suivant';
        });
    };

    $scope.nouvelleQuestion = function() {
        QuestionModel.getQuestionRapide(function(data) {
            $scope.question = data.question;

            $scope.userReponse = null;
            $scope.status = 'corriger';
        });
    };

    $scope.nouvelleQuestion();
}]);
