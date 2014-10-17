function QuizUser () {
//    this.questionsPassees = this.getVar("questionsPassees");
    this.examensPasses = this.getVar("examensPasses");

    //if (this.questionsPassees == null) this.questionsPassees = [];
    this.questionsPassees = [];
    if (this.examensPasses == null) this.examensPasses = [];
}

QuizUser.prototype = {
    getVar: function (variable) {
        return JSON.parse(localStorage.getItem(variable));
    },

    setVar: function (variable, value) {
        localStorage.setItem(variable, JSON.stringify(value));
    },

//    razQuestionsPassees: function () {
//        this.questionsPassees = [];
//        localStorage.removeItem("questionsPassees");
//    },

    raz: function () {
        localStorage.clear();
    },

    save: function () {
//        this.setVar("questionsPassees", this.questionsPassees);
        this.setVar("examensPasses", this.examensPasses);
    },

    addQuestion: function (id, reussie) {
        this.questionsPassees.push({
            "id": id,
            "reussie": reussie
        });
    },

    getIdsQuestionsPassees: function () {
        var ids = [];
        for (var id in this.questionsPassees) {
            ids.push(this.questionsPassees[id].id);
        }

        return ids;
    },

    getNbQuestionsPassees: function () {
        return this.questionsPassees.length;
    },

    addExamen: function (note, nbQuestions) {
        this.examensPasses.push({
            "date": new Date(),
            "note": note
        });
    },

    getMoyenneExamens: function () {
        var moyenne = 0;
        for (id in this.examensPasses) {
            moyenne += this.examensPasses[id].note / this.examensPasses.length;
        }

        return moyenne;
    },

    getPercQuestionsReussies: function () {
        var perc = 0;
        for (id in this.questionsPassees) {
            if (this.questionsPassees[id].reussie) {
                perc += 1 / this.questionsPassees.length;
            }
        }

        return perc;
    }
};