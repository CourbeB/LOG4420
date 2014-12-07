var mongoose   = require('mongoose');
var random = require('mongoose-simple-random');
var Schema = mongoose.Schema;

var r = new Schema({
    note: Number,
    date: Date,
    domaines: [String]
}, {collection: "Resultats"});
r.plugin(random);

var resultat = mongoose.model('Resultat', r);

module.exports = {

	sauveExamen: function (note, date, domaines, callback) {
		var result = new resultat({
            note: note,
            date: date,
            domaines: domaines
        });

        result.save(function(err) {
            callback(err);
        });
	},

	abortExamen: function (date, domaines, callback) {
		var result = new resultat({
            note: 0,
            date: date,
            domaines: domaines
        });

        result.save(function(err, res) {
            callback(err, res);
        });
	},

	getMoyenneExamens: function (callback){
		resultat.aggregate([{$group: {"_id": null, "moyenne": {"$avg": "$note"}}}], function(err, res) {
            callback(err, res);
        });
	},

	getDernierExam: function (callback) {
		resultat.find({}).sort({date:-1}).limit(1).exec(function (err, res) {
			callback(err, res);
		});
	},

	getExamens: function (callback) {
		resultat.find({}, function (err, res) {
			callback(err, res);
		});
	},

	removeResultats: function (callback) {
		resultat.find({}).remove().exec(function (err) {
			callback(err);
		});
	}
}