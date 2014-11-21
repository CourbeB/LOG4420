var mongoose   = require('mongoose');

// Config DB
var dbuser = "quizdbuser";
var dbpwd = "quizdbpwd";

mongoose.connect('mongodb://'+dbuser+':'+dbpwd+'@ds051720.mongolab.com:51720/quiz');

module.exports = mongoose;