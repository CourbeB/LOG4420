QuizApp.controller("QuestionExamenControlleur", ["$scope", "QuestionModel", function($scope, QuestionModel) {
    $scope.corriger = function () {
        QuestionModel.corriger($scope.userReponse, "exam", $scope.question.reponses, function() {
            $scope.status = ($scope.noQuestion == $scope.nbQuestions) ? 'terminer' : 'suivant';
        });
    };

    $scope.nouvelleQuestion = function() {
        QuestionModel.getQuestionExamen(function(data) {
            $scope.question = data.question;
            $scope.noQuestion = data.noQuestion;
            $scope.nbQuestions = data.nbQuestions;

            $scope.userReponse = null;
            $scope.status = 'corriger';
        });
    };

    $scope.nouvelleQuestion();
}]);
