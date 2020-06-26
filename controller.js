var model=require('./model.js')
var app=require('./app.js')
const bcrypt = require('bcrypt-nodejs');


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
		res.send('READ : Value equals '+answer.mess_id+' '+answer.room+' '+answer.pseudo+' '+answer.message+' '+answer.date+'.');
	});
}
/*
module.exports.apiPostMessage = async function(req) { // asynchrone function
	var message = new Answer(req.body);
	var savedMessage = await message.save();
	console.log("saved");
	io.emit("message", req.body);

    console.log("message post called");
	
}
*/

module.exports.createMessageForm = function() {
	return '<html><body><form method="post" action="create"><div><label for="room">Room :</label><input type="text" name="room" /></div><div><label for="pseudo">Pseudo :</label><input type="text" name="pseudo" /></div><div><label for="message">Message :</label><input type="text" name="message" /></div><input type="submit" /></form></body></html>';
}

module.exports.apiCreateMessage = function(room, pseudo, message) {
	var date = new Date() //date actuelle
	var answer = new model.Answer({room: room, pseudo: pseudo, message: message, date: date});
	answer.save();
	console.log('Message created');
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

inRoom = function(key, room) {
	app.redis_client.hget(key, 'room', function(err, obj){
		if (obj==room) {
			model.usersInRoom.push(key);
		}				
	});
}

module.exports.roomMessages = function(res, room, pseudo) {
	
	model.Answer.find({room: room}, function(err, answer) {
		var result ='<!DOCTYPE html>'+
			'<html>'+
				'<head>'+
					'<title>'+room+'</title>'+
		
					'<style type="text/css">.discussion-thread {border: 1px solid #bbb; width: 80%; height: 300px; overflow-y: scroll; padding: 10px;}</style>'+
		
				'</head>'+
		
				'<body>Welcome '+pseudo+' in the chat room '+room+' !<br/>'+
					'<a href="http://localhost:3000/chat/room/quit/'+room+'/'+pseudo+'">Leave the room</a>'+
					'<div class="users">Users in the room</br>';
		model.usersInRoom = [];
		app.redis_client.keys('*', function (err, keys) {
			for(var i = 0, len = keys.length; i < len; i++) {
				inRoom(keys[i], room);
			}
		});
		
		setTimeout(function(){
			result += model.usersInRoom+'<br/>';
			result +=	'</div>'+
					'<div class="discussion-thread">';
	
			for(var i=0; i<answer.length; i++) {
				result += '<div class="message">'+ answer[i].pseudo +':<br/>'+ answer[i].message +'<br/>'+ answer[i].date +'</div>';
			};
	
			result +='</div>'+
				'<form method="post" action="'+pseudo+'/create"><div><label for="message">Message :</label><input type="text" name="message" /></div><input type="submit"/></form>'+
			'</body>'+
			'</html>';
	
			res.send(result);
		},1000); // timeout of 1 second

		
		
	});
}

module.exports.readRooms = function(res, pseudo) {
	model.Room.find({}, function(err, room) {
		var result ='<!DOCTYPE html>'+
			'<html>'+
				'<head>'+
					'<title>Rooms</title>'+		
				'</head>'+
		
				'<body>Choose your chat room <br/>';

		for(var i=0; i<room.length; i++) {
			result += '<a href="http://localhost:3000/chat/room/connection/'+ room[i].name +'/'+pseudo+'">'+ room[i].name +'</a><br/>';
		};
		res.send(result+'</body></html>');
	});
}

module.exports.createRoom = function(name) {
	var room = new model.Room({name: name});
	room.save();
	console.log("New room added");
}

module.exports.deleteRoom = function(name) {
	model.Room.deleteOne({name: name}, function(err, room) {
		if(err){console.log(err);}
		else{console.log('DELETE : Variable '+name+' reduces to 0.');}
	});
}

module.exports.userInRoom = function(res, room, pseudo) {
	app.redis_client.hgetall(pseudo, function(err, object) {
		if (object['room']=='None') {
			password = object['password'];
			app.redis_client.del(pseudo);
			app.redis_client.hmset(pseudo, {'password': password, 'room': room});
			res.redirect('http://localhost:3000/chat/room/'+ room +'/'+ pseudo);
			console.log(pseudo+' enters in room '+room);
		}
		else {
			res.send('You already are in a room. Please quit the other room to enter in this one.');
		}
	});
}

module.exports.userOutRoom = function(room, pseudo) {
	app.redis_client.hgetall(pseudo, function(err, object) {
		password = object['password'];
		app.redis_client.del(pseudo);
		app.redis_client.hmset(pseudo, {'password': password, 'room': 'None'});
		console.log(pseudo+' leaves room '+room);
	});
}






module.exports.createUserForm = function() {
	return '<html><body>CREATE<br/><form method="post" action="create"><div><label for="pseudo">Pseudo :</label><input type="text" name="pseudo" /></div><div><label for="password">Password :</label><input type="text" name="password" /></div><input type="submit" /></form></body></html>';
}

module.exports.apiCreateUser = function(pseudo, password) {
	/* MongoDB
	var user = new model.User({pseudo: pseudo, password: password});
	user.save();
	*/
	//  Hash the password before saving it to the database
	bcrypt.genSalt(10, function(err, salt) {
		if (err)
			return next(err);

	    bcrypt.hash(password, salt, null, function(err, hash) {
	    	if (err)
	    		return next(err);
			password = hash;
			// Save the user into the db
			app.redis_client.hmset(pseudo, {'password': password, 'room': 'None'});
			console.log('User '+pseudo+' created.');
	    });
	});
}

module.exports.apiReadUser = function(res, pseudo) {
	/* MongoDB
	model.User.findOne({pseudo: pseudo},function(err, user){
		if(err){console.log(err);}
		res.send('READ : Value equals '+user.pseudo+'.');
	});
	*/
	var result = 'READ : Value '+pseudo+' equals ';
	app.redis_client.hgetall(pseudo, function(err, object) {
		result += 'password: '+object['password']+', room: '+object['room'];
		res.send(result+'.');
	});
}

module.exports.deleteUserForm = function(res) {
	/* MongoDB
	model.User.find({}, function(err, user) {
		var result = '<html><body>DELETE<br/><form method="post" action="delete"><div><label for="pseudo">Pseudo :</label><select name="pseudo">';
		var usernames = [];
		for (i in user) {
			usernames.push(user[i].pseudo);
		}
		for (i in usernames) {
			result += '<option value="'+usernames[i]+'">'+usernames[i]+'</option>';
		}
		res.send(result+'</select><input type="submit" /></form></body></html>');
	});
	*/
	var result = '<html><body>DELETE<br/><form method="post" action="delete"><div><label for="pseudo">Pseudo :</label><select name="pseudo">';
	app.redis_client.keys('*', function (err, keys) {
		if (err) return console.log(err);
	  
		for(var i = 0; i < keys.length; i++) {
		  result += '<option value="'+keys[i]+'">'+keys[i]+'</option>';
		}
		res.send(result+'</select><input type="submit" /></form></body></html>');
	}); 	
}

module.exports.apiDeleteUser = function(res, pseudo) {
	/*
	model.User.deleteOne({pseudo: pseudo}, function(err, user) {
		if(err){console.log(err);}
		else{res.send('DELETE : Variable '+pseudo+' reduces to 0.');}
	});
	*/
	app.redis_client.del(pseudo);
	res.send('DELETE : Variable '+pseudo+' reduces to 0.');

}

module.exports.connectionForm = function() {
	return '<html><body>CONNECTION<br/><form method="post" action="connection"><div><label for="pseudo">Pseudo :</label><input type="text" name="pseudo" /></div><div><label for="password">Password :</label><input type="text" name="password" /></div><input type="submit" /></form></body></html>';
}

module.exports.connection = function(res, pseudo, password) {
	/* MongoDB
	model.User.findOne({pseudo: pseudo}, function(err, user){ //il y a au maximum 1 utilisateur ayant ce pseudo
		if (user != null) {
			if (user.comparePassword(password)) {
				model.User.connected.push(user.pseudo);
				console.log(model.User.connected);
				res.send('<html><body>You are connected<br/><a href="http://localhost:3000/chat/room/read/'+pseudo+'">Go to chat rooms</a></body></html>');
			}
			else {
				res.send("Wrong password !");
			}
		}
		else {
			res.send("You have not the right !");
		}
	});
	*/
	app.redis_client.hgetall(pseudo, function(err, object) {
		if (object != null) {
			if (bcrypt.compareSync(password, String(object['password']))) { // if the password entered is correct
				console.log(pseudo+' is connected');
				res.send('<html><body>You are connected<br/><a href="http://localhost:3000/chat/room/read/'+pseudo+'">Go to chat rooms</a></body></html>');
			}
			else {
				res.send("Wrong password !");
			}
		}
		else {
			res.send("You have not the right !");
		}
	});

}

module.exports.adminPage = function(res) {
	result = '<html><body><div>User<br/>'+
		'<a href="http://localhost:3000/chat/api/user/create">Create a new user</a>'+
		'<form method="post" action="admin/user/read"><div><label for="username">Read a user : username</label><input type="text" name="username" /></div><input type="submit" /></form>'+
		'<a href="http://localhost:3000/chat/api/user/delete">Delete an user</a>'+
		'</div>'+
		'<div>Rooms<br/>';
	model.Room.find({}, function(err, room) {
		for(var i=0; i<room.length; i++) {
			result += room[i].name +'<br/>';
		};

		result +='<form method="post" action="admin/room/create"><div><label for="name">Add a room : name</label><input type="text" name="name" /></div><input type="submit"/></form>';
		result +='<form method="post" action="admin/room/delete"><div><label for="name">Delete a room : name</label><input type="text" name="name" /></div><input type="submit"/></form>';

		res.send(result+'</body></html>');
	});
}