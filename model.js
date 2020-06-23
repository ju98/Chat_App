const mongoose=require('mongoose');
const autoIncrement = require('mongoose-auto-increment');


var connection = mongoose.createConnection("mongodb://localhost/chat");
autoIncrement.initialize(connection);

var schemaAnswer=new mongoose.Schema({
	saloon: String,
	pseudo: String,
	message: String,
	date: Date,
});

schemaAnswer.plugin(autoIncrement.plugin, { model: 'Answer', field: 'mess_id' }); // auto increment of the attribute mess_id

module.exports.Answer=mongoose.model('Answer',schemaAnswer);
