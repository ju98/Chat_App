var model=require('./model.js')

module.exports.apiReadMessages = function(res) {
	model.Answer.find({}, function(err, answer) {
		/*
		result = '';
		for(var i=0; i<answer.length; i++) {
			result += answer[i].key + answer[i].text;
		};
		res.send(result);
		*/
		res.send(answer);
	});
}

module.exports.apiReadMessage = function(res, id) {
	model.Answer.findOne({mess_id: id},function(err,answer){
		if(err){console.log(err);}
		res.send('READ : Value equals '+answer.mess_id+' '+answer.saloon+' '+answer.pseudo+' '+answer.message+' '+answer.date+'.');
	});
}

module.exports.apiPostMessage = async function(req) { // asynchrone function
	var message = new Answer(req.body);
	var savedMessage = await message.save();
	console.log("saved");
	io.emit("message", req.body);

    console.log("message post called");
	
}

module.exports.createMessageForm = function() {
	return '<html><body><form method="post" action="create"><div><label for="saloon">Saloon :</label><input type="text" name="saloon" /></div><div><label for="pseudo">Pseudo :</label><input type="text" name="pseudo" /></div><div><label for="message">Message :</label><input type="text" name="message" /></div><input type="submit" /></form></body></html>';
}

module.exports.apiCreateMessage = function(saloon, pseudo, message) {
	var date = new Date() //date actuelle
	var answer = new model.Answer({saloon: saloon, pseudo: pseudo, message: message, date: date});
	answer.save();
}


module.exports.deleteMessageForm = function(res) {
	model.Answer.find({}, function(err, answer) {
		var result = '<html><body><form method="post" action="delete"><div><label for="mess_id">ID :</label><select name="mess_id">';
		var id = [];
		for (i in answer) {
			id.push(answer[i].mess_id);
		}
		for (i in id) {
			result += '<option value="'+id[i]+'">'+id[i]+'</option>';
		}
		res.send(result+'</select><input type="submit" /></form></body></html>');
	});
}

module.exports.apiDeleteMessage = function(res, id) {
	/*model.Answer.find({key: key}, function(err, answer) {
			console.log(answer);
	});*/
	model.Answer.deleteOne({mess_id: id}, function(err, answer) {
		if(err){console.log(err);}
		else{res.send('DELETE : Variable '+id+' reduces to 0.');}
	});
}